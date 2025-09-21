/***
 * This file contains the API configuration for the application.
 * It defines the base URL for different platforms.
 * It connects the application to the backend API.
 * 
 * author: Lukasz Brzozowski
 */

import appConfig from "../../app.json";

type ExtraConfig = {
  apiBaseUrl?: string;
};

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

const fallbackBaseUrl = (appConfig.expo?.extra as ExtraConfig | undefined)?.apiBaseUrl;

const resolvedBaseUrl =
  typeof envBaseUrl === "string" && envBaseUrl.length > 0
    ? envBaseUrl
    : typeof fallbackBaseUrl === "string" && fallbackBaseUrl.length > 0
      ? fallbackBaseUrl
      : undefined;

if (!resolvedBaseUrl) {
  throw new Error(
    "API base URL is not configured. Ensure EXPO_PUBLIC_API_BASE_URL is set or extra.apiBaseUrl is defined in app.config.ts."
  );
}

export const BASE_URL = resolvedBaseUrl;
