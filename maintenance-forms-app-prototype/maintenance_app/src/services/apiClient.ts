import { MaintenanceChecksApi } from "./MaintenanceChecksApi";
import { BASE_URL } from "src/config/api";

const apiClient = new MaintenanceChecksApi(BASE_URL);

export default apiClient;
