/***
 * This file contains the API configuration for the application.
 * It reads the base API URL from environment variables or falls back to the configuration defined in app.json.
 * The BASE_URL constant is exported for use in API calls throughout the app.
 * 
 * author: Lukasz Brzozowski
 */

import appConfig  from "../../app.json";


// Alternative approach using appConfig to read from environment variables
type ExtraConfig = {
  apiBaseUrl: string;
};

// Read the extra configuration from appConfig

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