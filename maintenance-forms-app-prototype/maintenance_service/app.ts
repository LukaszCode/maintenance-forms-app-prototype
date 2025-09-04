/**
 * This module defines the API endpoints for managing maintenance inspections.
 * It uses Express.js to create a RESTful API that allows clients to create and retrieve inspection records.
 * More details: https://expressjs.com/en/starter/installing.html
 *               https://expressjs.com/en/guide/routing.html
 *               TM352 - Block 2 - Express.js and RESTful APIs
 *
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { InspectionManager } from "./libraries/InspectionManager.js";
import { db } from "./data-layer/db/sqlite.js";

const app = express();

// Global middleware
app.use(cors()); // Allow the API to be accessed from other origins
app.use(bodyParser.json()); // Parse JSON request bodies into JavaScript objects

// Create an instance of the InspectionManager
const manager = new InspectionManager();

/**
 * Create a new inspection record.
 *
 *
 * @export
 * @param {string} inspectionId - The unique identifier for the inspection.
 * @param {Date} date - The date of the inspection.
 * @param {string} category - The category of the inspection.
 * @param {string} siteId - The ID of the site being inspected.
 * @param {string} zoneId - The ID of the zone being inspected.
 * @param {string} checkType - The type of check being performed.
 * @param {Array<string>} subchecks - The subchecks to be performed.
 * @param {string} comment - Any additional comments about the inspection.
 * @param {string} engineerName - The name of the engineer performing the inspection.
 * @returns {string} - A summary of the inspection details.
 *
 * @throws {Error} - If the inspection data is invalid.
 *   - If the inspection ID is missing or invalid.
 *   - If the date is not a valid date.
 *   - If the category is missing or invalid.
 *   - If the site ID is missing or invalid.
 *   - If the zone ID is missing or invalid.
 *   - If the check type is missing or invalid.
 *   - If the subchecks are missing or invalid.
 *   - If the comment is missing or invalid.
 *   - If the engineer name is missing or invalid.
 */

app.post("/inspections", (request, result) => {
  try {
    const saved = manager.createInspection(request.body);
    result.json({ status: "success", data: saved });
  } catch (error: any) {
    result.status(400).json({ status: "error", message: error.message });
  }
});

/**
 * Create a new site.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the site data.
 * @param {string} request.body.siteName - The name of the site to create.
 * @param {Object} result - The HTTP response object.
 * @returns {Object} The HTTP response with the created site data or an error message.
 */

app.post("/sites", (request, result) => {
  const { siteName } = request.body;
  if (!siteName?.trim())
    return result
      .status(400)
      .json({ status: "error", message: "siteName required" });
  const info = db
    .prepare(
      `
    INSERT OR IGNORE INTO sites(site_name) VALUES (?)
    `
    )
    .run(siteName.trim());
    const id =
      info.lastInsertRowid ??
      (db.prepare(
        `
        SELECT site_id 
        FROM sites 
        WHERE site_name=?
        `
      )
      .get(siteName.trim()) as { site_id: number }).site_id;
    result.json({ status: "success", data: { id, name: siteName.trim() } });
  });

/**
 * Retrieve all sites.
 * @param {Object} _request - The HTTP request object (not used).
 * @param {Object} result - The HTTP response object.
 *
 * @returns {Object} The HTTP response with the list of sites.
 *
 */
app.get("/sites", (_request, result) => {
  const rows = db
    .prepare(
      `
    SELECT site_id AS id, 
    site_name AS name FROM sites 
    ORDER BY site_name
  `
    )
    .all();
  result.json({ status: "success", data: rows });
});

/**
 * Retrieve all zones.
 * @param {Object} _request - The HTTP request object (not used).
 * @param {Object} result - The HTTP response object.
 * @returns {Object} The HTTP response with the list of zones.
 *
 */

app.get("/zones", (request, result) => {
  const siteId = Number(request.query.siteId) || null;
  const rows = db
    .prepare(
      `
    SELECT zone_id AS id, 
    zone_name AS name, 
    zone_description AS description, 
    site_id FROM zones 
    WHERE (? IS NULL OR site_id=?) 
    ORDER BY zone_name
  `
    )
    .all(siteId, siteId);
  result.json({ status: "success", data: rows });
});

/**
 * Retrieve a single inspection by its ID.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.params - The parameters from the request URL.
 * @param {string} request.params.id - The ID of the inspection to retrieve.
 * @param {Object} result - The HTTP response object.
 * @returns {Object} The HTTP response with the inspection data or an error message.
 *
 */

app.get("/inspections/:id", (request, result) => {
  const singleInspection = manager.getInspectionById(+request.params.id);
  if (!singleInspection) {
    return result
      .status(404)
      .json({ status: "error", message: "Inspection not found" });
  }
  result.json({ status: "success", data: singleInspection });
});

/**
 * Read item types by inspection category (Facilities or Machine Safety)
 * This endpoint dynamically retrieves item types based on the specified inspection category.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.category - The category of the inspection.
 * @param {Object} result - The HTTP response object.
 * @returns {Object} The HTTP response with the list of item types or an error message.
 */

app.get("/item-types", (request, result) => {
  const category =
    typeof request.query.category === "string"
      ? request.query.category.trim()
      : null;

  const rows = db
    .prepare(
      `
    SELECT item_type_id AS id,
           item_type_label AS label,
           inspection_category AS category,
           item_type_description AS description
    FROM item_types
    WHERE (? IS NULL OR inspection_category = ?)
    ORDER BY item_type_label
  `
    )
    .all(category, category);

  result.json({ status: "success", data: rows });
});

/**
 * Read items for a selected item type (e.g. Emergency Lights EL-01, Latitude, Supernova etc)
 * This endpoint retrieves all items associated with a specific item type.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.itemTypeId - The ID of the item type.
 * @param {Object} result - The HTTP response object.
 * @returns {Object} The HTTP response with the list of items or an error message.
 */

app.get("/items", (request, result) => {
  const zoneId = request.query.zoneId ? Number(request.query.zoneId) : null;
  const itemType =
    typeof request.query.itemType === "string"
      ? request.query.itemType.trim()
      : null;

  const rows = db
    .prepare(
      `
    SELECT item_id AS id,
           item_name AS name,
           description,
           zone_id,
           item_type
    FROM items
    WHERE (? IS NULL OR zone_id = ?)
      AND (? IS NULL OR item_type = ?)
    ORDER BY item_name
  `
    )
    .all(zoneId, zoneId, itemType, itemType);

  result.json({ status: "success", data: rows });
});

/**
 * Retrieve subcheck templates for a given item type.
 * This endpoint fetches subcheck templates associated with a specific item type.
 * It is used to build the inspection subchecks dynamically based on the selected item type.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.itemTypeId - The ID of the item type.
 * @param {Object} result - The HTTP response object.
 * @returns {Object} The HTTP response with the list of subcheck templates or an error message.
 */

app.get("/subcheck-templates", (req, res) => {
  const itemTypeId = Number(req.query.itemTypeId);
  if (!Number.isFinite(itemTypeId)) {
    return res
      .status(400)
      .json({ status: "error", message: "itemTypeId must be a number" });
  }

  const rows = db
    .prepare(
      `
    SELECT sub_template_id          AS id,
           sub_template_label       AS name,
           sub_template_description AS description,
           value_type               AS valueType,
           pass_criteria            AS passCriteria,
           sub_template_mandatory   AS mandatory
    FROM subcheck_templates
    WHERE item_type_id = ?
    ORDER BY sub_template_id
  `
    )
    .all(itemTypeId);

  res.json({ status: "success", data: rows });
});

/**
 * Get subcheck templates by item type label.
 * This endpoint retrieves subcheck templates associated with a specific item type label.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with the list of subcheck templates or an error message.
 */
app.get("/subcheck-templates/by-label", (req, res) => {
  const label = typeof req.query.itemType === "string" ? req.query.itemType.trim() : "";
  if (!label) return res.status(400).json({ status:"error", message:"itemType (label) is required" });

  const type = db.prepare(`SELECT item_type_id FROM item_types WHERE item_type_label = ?`).get(label) as { item_type_id: number } | undefined;
  if (!type) return res.json({ status:"success", data: [] });

  const rows = db.prepare(`
    SELECT sub_template_id          AS id,
           sub_template_label       AS name,
           sub_template_description AS description,
           value_type               AS valueType,
           pass_criteria            AS passCriteria,
           sub_template_mandatory   AS mandatory
    FROM subcheck_templates
    WHERE item_type_id = ?
    ORDER BY sub_template_id
  `).all(type.item_type_id);

  res.json({ status:"success", data: rows });
});

// Health check endpoint
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
