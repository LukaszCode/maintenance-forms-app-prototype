/**
 * API client for interacting with the maintenance checks API.
 * This client is responsible for making requests to the API endpoints
 * and handling responses.
 */

import { MaintenanceChecksApi } from "./MaintenanceChecksApi";
import { BASE_URL } from "src/config/api";

const apiClient = new MaintenanceChecksApi(BASE_URL);

export default apiClient;
