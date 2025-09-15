/***
 * This file contains the API configuration for the application.
 * It defines the base URL for different platforms.
 * It connects the application to the backend API.
 * 
 * author: Lukasz Brzozowski
 */

import { Platform } from "react-native";

export const BASE_URL = Platform.select({
  ios: "http://192.168.0.6:3001",
  android: "http://192.168.0.6:3001",
  default: "http://192.168.0.6:3001",
});