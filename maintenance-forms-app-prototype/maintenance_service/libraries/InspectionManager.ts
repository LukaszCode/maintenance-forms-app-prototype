import { Database } from "sqlite";
import { openDatabase } from "../data-layer/db/sqlite";

export class InspectionManager {
  private db: Database;

  constructor() {
    this.db = openDatabase();
  }

  createInspection(input: InspectionInput): InspectionRecord {
    // Validate and process the input
    const 
  }

}