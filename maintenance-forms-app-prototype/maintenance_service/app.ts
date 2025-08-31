/*
    This module defines the API endpoints for managing maintenance inspections.
    It uses Express.js to create a RESTful API that allows clients to create and retrieve inspection records.
    More details: https://expressjs.com/en/starter/installing.html
                    https://expressjs.com/en/guide/routing.html
                    TM352 - Block 2 - 
*/

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { InspectionManager } from "./libraries/InspectionManager";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const manager = new InspectionManager();

app.post("/inspections", (request, result) => {
  const { engineerId, category, siteId, zoneId, checkType, subchecks } = request.body;
  try {
    const inspection = manager.createInspection({ engineerId, category, siteId, zoneId, checkType, subchecks });
    result.send({ status: "success", data: inspection });
  } catch (error: any) {
    result.status(400).send({ status: "error", message: error.message });
  }
});

app.get("/inspections", (request, result) => {
    const { from, to, siteId, engineerId  } = request.query;
    const list = manager.findInspections({ from, to, siteId, engineerId });
    result.send({ status: "success", data: list });
});

app.get("/inspections/:id", (request, result) => {
    const one = manager.getInspectionById(+request.params.id);
    if (!one) {
        return result.status(404).send({ status: "error", message: "Inspection not found" });
    }
    result.send({ status: "success", data: one });
});

app.listen(3001, () => console.log("Maintenance API listening on :3001"));
