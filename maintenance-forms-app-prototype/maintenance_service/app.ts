/**
 * This module defines the API endpoints for managing maintenance inspections.
 * It uses Express.js to create a RESTful API that allows clients to create and retrieve inspection records.
 * More details: https://expressjs.com/en/starter/installing.html
 *               https://expressjs.com/en/guide/routing.html
 *               TM352 - Block 2 - Express.js and RESTful APIs
 * 
 * This file is part of the Maintenance Forms App backend service.
 * 
 * author: Lukasz Brzozowski
 *
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { InspectionManager } from "./libraries/InspectionManager.js";
import { db } from "./data-layer/db/sqlite.js";
import bcrypt from "bcrypt";

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

app.post("/inspections", (request, response) => {
  try {
    const saved = manager.createInspection(request.body);
    response.json({ status: "success", data: saved });
  } catch (error: any) {
    response
      .status(400)
      .json({ 
        status: "error", 
        message: error.message 
      });
    }
});

/**
 * Create a new site.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the site data.
 * @param {string} request.body.siteName - The name of the site to create.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the created site data or an error message.
 */

app.post("/sites", (request, response) => {
  const { siteName } = request.body;
  if (!siteName?.trim())
    return response
      .status(400)
      .json({ status: "error", message: "Site name is required" });

  const info = db
    .prepare(`
      INSERT OR IGNORE INTO sites (site_name)
      VALUES (?)
    `)
    .run(siteName.trim());

  const id =
    Number(info.lastInsertRowid) ||
    (db
      .prepare(
        `SELECT site_id AS id
         FROM sites
         WHERE site_name=?`
      )
      .get(siteName.trim()) as { id: number }).id;
  
  response.json({ 
    status: "success", 
    data: { id, name: siteName.trim() } 
  });
});

/**
 * Create a new zone.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the zone data.
 * @param {string} request.body.zoneName - The name of the zone to create.
 * @param {string} request.body.zoneDescription - The description of the zone to create.
 * @param {string} request.body.siteId - The ID of the site to associate the zone with.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the created zone data or an error message.
 */
app.post("/zones", (request, response) => {
  const { siteId, zoneName, zoneDescription } = request.body ?? {};

  if (!Number.isInteger(siteId)) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Site ID is required and must be a number" 
      });
  }
  if (!zoneName?.trim()) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Zone name is required" 
      });
  }

  const info = db
    .prepare(`
      INSERT OR IGNORE INTO zones (zone_name, zone_description, site_id)
      VALUES (?, ?, ?)`)
    .run(zoneName.trim(), zoneDescription ?? null, siteId);

  const info = db
    .prepare(`
      INSERT OR IGNORE INTO zones (zone_name, zone_description, site_id)
      VALUES (?, ?, ?)`)
    .run(zoneName.trim(), zoneDescription ?? null, siteId);

  const row = db
    .prepare(`
      SELECT zone_id AS id
      FROM zones
      WHERE site_id=?
      AND zone_name=?`)
    .get(siteId, zoneName.trim()) as { id: number } | undefined;

  const id = Number(info.lastInsertRowid) || row?.id;
  const name = zoneName.trim();

  response.json({
    status: "success",
    data: { id, name, siteId }
  });
});

        SELECT zone_id AS id
        FROM zones
        WHERE site_id=? 
        AND zone_name=?`)
    });
});

/**
 * Create a new item.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the item data.
 * @param {string} request.body.zoneId - The ID of the zone to associate the item with.
 * @param {string} request.body.itemType - The type of the item to create.
 * @param {string} request.body.itemName - The name of the item to create.
 * @param {string} request.body.itemDescription - The description of the item to create.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the created item data or an error message.
 */

app.post("/items", (request, response) => {
  const { zoneId, itemType, itemName, itemDescription } = request.body ?? {};
  if (!Number.isInteger(zoneId)) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Zone ID is required and must be a number" 
      });
  }
  if (!itemType?.trim()) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Item type is required" 
      });
  }

  const info = db
    .prepare(`
      INSERT OR IGNORE INTO items(item_type, item_name, item_description, zone_id)
      VALUES (?, ?, ?, ?)`)
    .run(itemType.trim(), itemName.trim(), itemDescription ?? null, zoneId);

  const id = Number(info.lastInsertRowid)|| 
    (db
      .prepare(`
        SELECT item_id AS id
        FROM items
        WHERE zone_id=?
        AND item_type=?
        AND item_name=?`)
      .get(zoneId, itemType.trim(), itemName.trim()) as { id: number } | undefined)?.id;

    response.json({ 
      status: "success", 
      data: { id, item_name: itemName.trim(), zone_id: zoneId, item_type: itemType.trim() }
    });
});

/**
 * Create a new site, by (siteName)  (create if not existing)
 * This endpoint checks if a site with the given name exists.
 * If it does not exist, it creates a new site with that name.
 * It returns the site ID and name.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the site name.
 * @param {string} request.body.siteName - The name of the site to ensure.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the ensured site data or an error message.
 */

app.post("/sites/ensure", (request, response) => {
  const siteName = String(request.body.siteName || "").trim();
  if (!siteName) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Site name is required" 
      });
  }

  const info = db
    .prepare(`
      INSERT OR IGNORE 
      INTO sites(site_name) 
      VALUES (?)`)
    .run(siteName);

  const id = Number(info.lastInsertRowid) ||
    (db
      .prepare(`
        SELECT site_id AS id 
        FROM sites 
        WHERE site_name=?`)
      .get(siteName) as any)?.id;

  response.json({ 
    status: "success", 
    data: { id, name: siteName } });
});


/**
 * Create a new zone under a site, by (siteId, zoneName)  (create if not existing)
 * This endpoint checks if a zone with the given name exists under the specified site.
 * If it does not exist, it creates a new zone with that name under the specified site.
 * It returns the zone ID, name, and associated site ID.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the zone data.
 * @param {string} request.body.siteId - The ID of the site to associate the zone with.
 * @param {string} request.body.zoneLabel - The label of the zone to ensure.
 * @param {string} request.body.zoneDescription - The description of the zone to create (optional).
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the ensured zone data or an error message.
 */

app.post("/zones/ensure", (request, response) => {
  const siteId = Number(request.body.siteId);
  const zoneLabel = String(request.body.zoneLabel || "").trim();
  const description = (request.body.zoneDescription ?? "") as string;

  if (!Number.isFinite(siteId)) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Site ID does not exist" 
      });
  }
  if (!zoneLabel) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Zone label is required" 
      });
  }

  // ensure unique zone per (site, label)
  const exists = db
    .prepare(`
      SELECT zone_id AS id
      FROM zones
      WHERE site_id=?
      AND zone_name=?`)
    .get(siteId, zoneLabel) as { id: number } | undefined;

  if (exists) {
    return response
      .status(200)
      .json({ 
        status: "success", 
        data: { id: exists.id, name: zoneLabel, siteId } 
      });
  } 

  const info = db
    .prepare(`
      INSERT INTO zones (zone_name, zone_description, site_id)
      VALUES (?,?,?)`)
    .run(zoneLabel, description, siteId);

  response.json({
    status: "success", 
    data: { id: Number(info.lastInsertRowid), name: zoneLabel, siteId } 
  });
});


/**
 * Create a new item under a zone, by (item_type, item_name)  (create if not existing)
 * This endpoint checks if an item with the given type and name exists under the specified zone.
 * If it does not exist, it creates a new item with that type and name under the specified zone.
 * It returns the item ID, name, type, and associated zone ID.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the item data.
 * @param {string} request.body.zoneId - The ID of the zone to associate the item with.
 * @param {string} request.body.itemType - The type of the item to ensure.
 * @param {string} request.body.itemName - The name of the item to ensure.
 * @param {string} request.body.description - The description of the item to create (optional).
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the ensured item data or an error message.
 */

app.post("/items/ensure", (request, response) => {
  const zoneId = Number(request.body.zoneId);
  const itemType = String(request.body.itemType || "").trim();
  const itemName = String(request.body.itemName || "").trim();
  const description = (request.body.description ?? "") as string;

  if (!Number.isFinite(zoneId)) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Zone ID is required" 
      });
  }
  if (!itemType) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Item Type is required" 
      });
  }
  if (!itemName) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Item Name is required" 
      });
  }

  const exists = db
    .prepare(`
      SELECT item_id AS id
      FROM items
      WHERE zone_id=?
      AND item_type=?
      AND item_name=?`)
    .get(zoneId, itemType, itemName) as { id: number } | undefined;

  if (exists) {
    return response
      .json({ 
        status: "success", 
        data: { id: exists.id, name: itemName, zoneId, itemType } 
      });
  }

  const info = db
    .prepare(`
      INSERT INTO items
      (item_type, item_name, item_description, zone_id)
      VALUES (?,?,?,?)`)
    .run(itemType, itemName, description, zoneId);

  response.json({
    status: "success",
    data: { id: Number(info.lastInsertRowid), name: itemName, zoneId, itemType },
  });
});

/**
 * Allow creating new item types (e.g. Emergency Lights, Fire Extinguishers etc)
 * This endpoint allows the creation of new item types for inspections.
 * It checks if an item type with the given label already exists.
 * If it does not exist, it creates a new item type with the provided label, category, and description.
 * It returns the item type ID, label, category, and description.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.body - The request body containing the item type data.
 * @param {string} request.body.label - The label of the item type to create.
 * @param {string} request.body.category - The category of the item type (e.g. "Facility" or "Machine Safety").
 * @param {string} request.body.description - The description of the item type (optional).
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the created item type data or an error message.
 */

app.post("/item-types/ensure", (request, response) => {
  const category = String(request.body.category || "").trim(); // should be either "Facility" or "Machine Safety"
  const label = String(request.body.itemTypeLabel || "").trim();
  const description = (request.body.description ?? "") as string; 

  if(!category) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Inspection category is required" });
  }

  if (!label) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Item type label is required" });
  }

  const exists = db
    .prepare(`
      SELECT item_type_id AS id
      FROM item_types
      WHERE inspection_category=?
      AND item_type_label=?`)
    .get(category, label) as { id: number } | undefined;

  if (exists) {
    return response
      .json({ 
        status: "success", 
        data: { id: exists.id, label, category } 
      });
  }
  const info = db
    .prepare(`
      INSERT INTO item_types (inspection_category, item_type_label, item_type_description)
      VALUES (?, ?, ?)`)
    .run(category, label, description);

  response.json({ 
    status: "success", 
    data: { id: Number(info.lastInsertRowid), label, category },
  });
});


/**
 * Read subcheck templates by item_type label 
 * This endpoint retrieves subcheck templates associated with a specific item type label.
 * It first looks up the item type ID based on the provided label, then fetches the corresponding subcheck templates.
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.itemType - The label of the item type.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the list of subcheck templates or an error message.
 */

app.get("/subcheck-templates/by-label", (request, response) => {
  const itemTypeLabel = typeof request.query.itemType === "string" ? request.query.itemType.trim() : "";
  if (!itemTypeLabel) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "Item type is required" 
    });
  }

  const typeRow = db
    .prepare(`
      SELECT item_type_id 
      FROM item_types 
      WHERE item_type_label = ?`)
    .get(itemTypeLabel) as { item_type_id: number } | undefined;

  if (!typeRow) {
    return response
      .json({ status: "success", data: [] });
  }
  
  const rows = db
    .prepare(`
      SELECT 
        subcheck_template_id AS id,
        subcheck_template_label AS name,
        subcheck_template_description AS description,
        value_type AS valueType,
        pass_criteria AS passCriteria,
        subcheck_template_mandatory AS mandatory
      FROM subcheck_templates
      WHERE item_type_id = ?
      ORDER BY subcheck_template_id`)

    .all(typeRow.item_type_id);

  response.json({ 
    status: "success",
    data: rows 
  });
});

/**
 * Register a new user (engineer).
 * This endpoint allows the registration of a new user with the role of "Engineer".
 * It requires an email, password, and full name.
 * If the email is already registered, it returns a conflict error.
 * Passwords are hashed before storing in the database for security.
 * @param {Object} request - The HTTP request object.
 * @returns {Object} The HTTP response with the created user data or an error message.
 */
app.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ status: "error", message: "Missing required fields" });
  }

  try {
    const username = email.split("@")[0];

    const passwordHash = await bcrypt.hash(password, 10);
    const info = db.prepare(`
      INSERT INTO users (username, full_name, password_hash, role, email)
      VALUES (?, ?, ?, 'Engineer', ?)
    `).run(username, fullName, passwordHash, email);

    res.status(201).json({ status: "success", userId: info.lastInsertRowid });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ status: "error", message: "Email already registered" });
    }

    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * User login endpoint.
 * This endpoint allows users to log in by providing their email and password.
 * It verifies the credentials and returns a mock token and user details upon successful authentication.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with the login status, token, and user details or an error message.
 * @throws {Error} If the login process fails due to server issues.
 * @returns {Object} The HTTP response with the login status, token, and user details or an error message.
*/
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Missing email or password" });
  }

  try {
    const user = db
      .prepare(`SELECT user_id, email, full_name, password_hash FROM users WHERE email = ?`)
      .get(email) as {
        user_id: number;
        email: string;
        full_name: string;
        password_hash: string;
      } | undefined;

    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // Simulate a JWT/token generation (in a real app I will use a library like jsonwebtoken)
    const fakeToken = `mock-token-${user.user_id}`;

    res.json({
      status: "success",
      token: fakeToken,
      userId: user.user_id,
      fullName: user.full_name,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
});


/**
 * Retrieve all sites.
 * @param {Object} _request - The HTTP request object (not used).
 * @param {Object} response - The HTTP response object.
 *
 * @returns {Object} The HTTP response with the list of sites.
 *
 */
app.get("/sites", (_request, response) => {
  const rows = db
    .prepare(`
      SELECT site_id AS id, 
      site_name AS name 
      FROM sites 
      ORDER BY site_name`)
    .all();
  response.json({ 
    status: "success", 
    data: rows 
  });
});

/**
 * Retrieve all zones.
 * @param {Object} _request - The HTTP request object (not used).
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the list of zones.
 *
 */

app.get("/zones", (request, response) => {
  const siteId = Number(request.query.siteId) || null;
  const rows = db
    .prepare(`
      SELECT 
        zone_id AS id, 
        zone_name AS name,
        zone_description AS description, 
        site_id 
      FROM zones 
      WHERE (? IS NULL OR site_id=?) 
      ORDER BY zone_name`)
    .all(siteId, siteId);
  response.json({ 
    status: "success", 
    data: rows 
  });
});

/**
 * Retrieve a single inspection by its ID.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.params - The parameters from the request URL.
 * @param {string} request.params.id - The ID of the inspection to retrieve.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the inspection data or an error message.
 *
 */

app.get("/inspections/:id", (request, response) => {
  const singleInspection = manager.getInspectionById(+request.params.id);
  if (!singleInspection) {
    return response
      .status(404)
      .json({ 
        status: "error", 
        message: "Inspection not found" 
      });
  }
  response.json({ status: "success", data: singleInspection });
});

/**
 * Retrieve all inspections (summary view).
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the list of inspection summaries.
 */
app.get("/inspections", (_request, response) => {
  const rows = db
    .prepare(`
      SELECT 
        i.inspection_id AS id,
        i.inspection_date AS date,
        i.inspection_category AS category,
        i.item_id,
        it.item_name,
        z.zone_name AS zoneName,
        s.site_name AS siteName,
        u.full_name AS engineerName,
        i.overall_result AS result
      FROM inspections i
      JOIN items it ON i.item_id = it.item_id
      JOIN zones z ON it.zone_id = z.zone_id
      JOIN sites s ON z.site_id = s.site_id
      JOIN users u ON i.engineer_id = u.user_id
      ORDER BY i.inspection_date DESC, i.inspection_id DESC
    `)
    .all();

  response.json({ status: "success", data: rows });
});


/**
 * Read item types by inspection category (Facilities or Machine Safety)
 * This endpoint dynamically retrieves item types based on the specified inspection category.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.category - The category of the inspection.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the list of item types or an error message.
 */

app.get("/item-types", (request, response) => {
  const category =
    typeof request.query.category === "string"
      ? request.query.category.trim()
      : null;

  const rows = db
    .prepare(`
    SELECT item_type_id AS id,
           item_type_label AS label,
           inspection_category AS category,
           item_type_description AS description
    FROM item_types
    WHERE (? IS NULL OR inspection_category = ?)
    ORDER BY item_type_label
  `)
    .all(category, category);

  response.json({ status: "success", data: rows });
});

/**
 * Read items for a selected item type (e.g. Emergency Lights EL-01, Latitude, Supernova etc)
 * This endpoint retrieves all items associated with a specific item type.
 * If a zoneId is provided, it filters items by that zone.
 * 
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.itemTypeId - The ID of the item type.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the list of items or an error message.
 */

app.get("/items", (request, response) => {
  const zoneId = request.query.zoneId !== undefined && request.query.zoneId !== "" 
    ? Number(request.query.zoneId) : null;

  const itemType =
    typeof request.query.itemType === "string"
      && request.query.itemType.trim()
      ? request.query.itemType.trim()
      : null;

  const rows = db
    .prepare(`
      SELECT 
        item_id AS id,
        item_name AS name,
        item_description AS description,
        zone_id,
        item_type
      FROM items
      WHERE (? IS NULL OR zone_id = ?)
      AND (? IS NULL OR item_type = ?)
      ORDER BY item_name`)
    .all(zoneId, zoneId, itemType, itemType);

  response.json({ status: "success", data: rows });
});

/**
 * Retrieve subcheck templates for a given item type.
 * This endpoint fetches subcheck templates associated with a specific item type.
 * It is used to build the inspection subchecks dynamically based on the selected item type.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} request.query - The query parameters from the request URL.
 * @param {string} request.query.itemTypeId - The ID of the item type.
 * @param {Object} response - The HTTP response object.
 * @returns {Object} The HTTP response with the list of subcheck templates or an error message.
 */

app.get("/subcheck-templates", (request, response) => {
  const itemTypeId = Number(request.query.itemTypeId);
  if (!Number.isFinite(itemTypeId)) {
    return response
      .status(400)
      .json({ 
        status: "error", 
        message: "itemTypeId must be a number" 
      });
  }

  const rows = db
    .prepare(`
      SELECT 
        subcheck_template_id AS id,
        subcheck_template_label AS name,
        subcheck_template_description AS description,
        value_type AS valueType,
        pass_criteria AS passCriteria,
        subcheck_template_mandatory AS mandatory
      FROM subcheck_templates
      WHERE item_type_id = ?
      ORDER BY subcheck_template_id`)
    .all(itemTypeId);

  response.json({ status: "success", data: rows });
});

// Health check endpoint
app.get("/health", (_request, response) => response.json({ ok: true }));

// Start the server
app.listen(3001, '0.0.0.0', () => {
  console.log("Server is running on http://192.168.0.6:3001");
});