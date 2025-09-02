/**
 * This class provides methods for interacting with the maintenance checks API.
 * It includes methods for creating, retrieving, and updating inspection forms.
 * It communicates with a RESTful backend service to perform these operations.
 * @class MaintenanceChecksApi
 * @param {string} baseUrl - The base URL of the API.
 * @param {string} [token] - The authentication token for the API.
 *
 * author: Lukasz Brzozowski
 */

export class MaintenanceChecksApi {
  constructor(private baseUrl: string, private token?: string) {}

  private headers() {
    return {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  /**
   * Retrieve all sites.
   * @returns A promise that resolves to the list of sites.
   */
  sites() {
    return fetch(`${this.baseUrl}/sites`).then((res) => res.json());
  }

  /**
   * Retrieve all zones based on site ID.
   * @param siteId - The ID of the site to filter zones.
   * @returns A promise that resolves to the list of zones.
   */
  zones(siteId?: number) {
    const query = siteId ? `?siteId=${siteId}` : "";
    return fetch(`${this.baseUrl}/zones${query}`).then((res) => res.json());
  }

  /**
   * Retrieve item types based on category.
   * @param category - The category to filter item types.
   * @returns A promise that resolves to the list of item types.
   */
  itemTypes(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return fetch(`${this.baseUrl}/item-types${query}`).then((res) =>
      res.json()
    );
  }

  /**
   * Retrieve items based on zone ID and item type.
   * @param zoneId - The ID of the zone to filter items.
   * @param itemType - The type of the item to filter items.
   * @returns A promise that resolves to the list of items.
   */
  items(zoneId?: number, itemType?: string) {
    const params: string[] = [];
    if (zoneId) {
      params.push(`zoneId=${zoneId}`);
    }
    if (itemType) {
      params.push(`itemType=${encodeURIComponent(itemType)}`);
    }
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    return fetch(`${this.baseUrl}/items${query}`).then((res) => res.json());
  }

  /**
   * Retrieve subcheck templates based on item type ID.
   * @param itemTypeId - The ID of the item type to filter templates.
   * @returns A promise that resolves to the list of subcheck templates.
   */
  templatesByTypeId(itemTypeId: number) {
    return fetch(
      `${this.baseUrl}/subcheck-templates?itemTypeId=${itemTypeId}`
    ).then((res) => res.json());
  }

  /**
   * Retrieve subcheck templates based on item type label.
   * @param itemTypeLabel - The label of the item type to filter templates.
   * @returns A promise that resolves to the list of subcheck templates.
   */
  templatesByLabel(itemTypeLabel: string) {
    return fetch(
      `${this.baseUrl}/subcheck-templates?label=${encodeURIComponent(
        itemTypeLabel
      )}`
    ).then((res) => res.json());
  }

  /**
   * User login.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to the login response.
   */
  async login(username: string, password: string) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      throw new Error(`Login failed: ${res.statusText}`);
    }
    return res.json() as Promise<{ token: string; fullName: string }>;
  }
}
