
/*
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
*
* @returns {string} - A summary of the inspection details.
* 
*/

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { InspectionManager } from "./libraries/InspectionManager.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const manager = new InspectionManager();

/*
* Creates a new inspection record.
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
*/

app.post("/inspections", (request, result) => {
  const { inspectionId, date, category, siteId, zoneId, checkType, subchecks, comment, engineerName } = request.body;
  try {
    const inspection = manager.createInspection({
        inspectionId, date, category, siteId, zoneId, checkType, subchecks, comment, engineerName,
        stringify: function (): string {
            throw new Error("Function not implemented.");
        },
        displayFormDetails: function (): void {
            throw new Error("Function not implemented.");
        }
    });
    result.send({ status: "success", data: inspection });
  } catch (error: any) {
    result.status(400).send({ status: "error", message: error.message });
  }
});

/*
* Retrieves a list of all inspections.
*
* @returns {Array<Inspection>} - An array of all inspections.
* 
*/

app.get("/inspections", (request, result) => {
    const list = manager.inspections;
    result.send({ status: "success", data: list });
});

/*
* Retrieves a specific inspection by its ID.
*
* @param {string} id - The unique identifier for the inspection.
* @returns {Inspection | null} - The inspection object if found, or null if not found.
* 
*/

app.get("/inspections/:id", (request, result) => {
    const one = manager.getInspectionById(+request.params.id);
    if (!one) {
        return result.status(404).send({ status: "error", message: "Inspection not found" });
    }
    result.send({ status: "success", data: one });
});

app.listen(3001, () => console.log("Maintenance API listening on :3001"));
