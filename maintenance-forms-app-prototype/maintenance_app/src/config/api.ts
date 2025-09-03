/***
 * This file contains the API configuration for the application.
 * It defines the base URL for different platforms.
 * It connects the application to the backend API.
 */

import { Platform } from "react-native";

export const BASE_URL = Platform.select({
  ios: "http://localhost:3001",
  android: "http://10.0.2.2:3001",
  default: "http://10.0.2.2:3001",
});
