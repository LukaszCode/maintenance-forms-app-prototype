import { ConfigContext, ExpoConfig } from "expo/config";

const DEFAULT_API_BASE_URL = "http://192.168.0.6:3001";

type ExtraConfig = {
  apiBaseUrl?: string;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const fallbackApiBaseUrl =
    (config.extra as ExtraConfig | undefined)?.apiBaseUrl ?? DEFAULT_API_BASE_URL;

  return {
    ...config,
    name: config.name ?? "maintenance-forms-app-prototype",
    slug: config.slug ?? "maintenance-forms-app-prototype",
    extra: {
      ...config.extra,
      apiBaseUrl:
        process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackApiBaseUrl,
    },
  };
};
