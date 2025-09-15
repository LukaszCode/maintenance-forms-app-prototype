/***
 * This file contains the API configuration for the application.
 * It defines the base URL for different platforms.
 * It connects the application to the backend API.
 */

import { Platform } from "react-native";

export const BASE_URL = Platform.select({
  ios: "exp://192.168.0.6:3001",
  android: "exp://192.168.0.6:3001",
  default: "exp://192.168.0.6:3001",
});