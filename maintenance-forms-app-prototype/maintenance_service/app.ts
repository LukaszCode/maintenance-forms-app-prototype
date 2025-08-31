/*
    This module sets up the Express application and middleware for the maintenance checks API.  
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

