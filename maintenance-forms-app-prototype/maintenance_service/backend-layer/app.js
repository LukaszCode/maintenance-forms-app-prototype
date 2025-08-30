/*
    This module sets up the Express application and middleware for the maintenance checks API.  
    More details: https://expressjs.com/en/starter/installing.html
*/

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// TODO: app.get("/api/inspection-templates", ...), app.post("/api/inspections", ..

module.exports = app;
