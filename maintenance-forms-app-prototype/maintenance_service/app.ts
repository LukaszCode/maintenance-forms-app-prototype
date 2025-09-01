
/**
 * This module defines the API endpoints for managing maintenance inspections.
 * It uses Express.js to create a RESTful API that allows clients to create and retrieve inspection records.
 * More details: https://expressjs.com/en/starter/installing.html
 *               https://expressjs.com/en/guide/routing.html
 *               TM352 - Block 2 - Express.js and RESTful APIs
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
*/

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { InspectionManager } from "./libraries/InspectionManager.js";
import { db } from "./data-layer/db/sqlite.js";

const app = express();

// Global middleware
app.use(cors());  // Allow the API to be accessed from other origins
app.use(bodyParser.json()); // Parse JSON request bodies into JavaScript objects

// Create an instance of the InspectionManager
const manager = new InspectionManager(); 

/**
* Create a new inspection record.
* @param {Object} inspectionData - The data for the new inspection.
* @returns {Inspection} - The created inspection object.
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
        return result.status(404).json({ status: "error", message: "Inspection not found" });
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
  const { category } = request.query;
  const list = db.prepare(`
    SELECT it_type.item_type_id AS id, it_type.name
    FROM item_types it_type
    JOIN inspection_categories insp_cat ON insp_cat.category_id = it_type.category_id
    WHERE (? IS NULL OR insp_cat.name = ?)
    ORDER BY it_type.name
  `).all(category ?? null, category ?? null);

  result.json({ status: "success", data: list });
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
  const { itemTypeId } = request.query;
  const list = db.prepare(`
    SELECT item_id AS id, item_name AS name, description
    FROM items
    WHERE (? IS NULL OR item_type_id = ?)
    ORDER BY item_name
  `).all(itemTypeId ?? null, itemTypeId ?? null);
  result.json({ status: "success", data: list });
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

app.get("/subcheck-templates", (request, result) => {
  const { itemTypeId } = request.query;
  const list = db.prepare(`
    SELECT subcheck_template_id AS id,
           name,
           description,
           value_type   AS valueType,
           pass_criteria AS passCriteria
    FROM subcheck_templates
    WHERE item_type_id = ?
    ORDER BY subcheck_template_id
  `).all(Number(itemTypeId));
  result.json({ status: "success", data: list });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
})