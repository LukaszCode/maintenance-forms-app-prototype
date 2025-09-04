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
     return fetch(`${this.baseUrl}/sites`).then(r => r.json()); 
    }
  
  /**
   * Retrieve all zones based on site ID.
   * @param siteId - The ID of the site to filter zones.
   * @returns A promise that resolves to the list of zones.
   */
  zones(siteId?: number) {
    const q = siteId ? `?siteId=${siteId}` : "";
    return fetch(`${this.baseUrl}/zones${q}`).then(r => r.json());
  }


  /**
   * Retrieve item types based on category.
   * @param category - The category to filter item types.
   * @returns A promise that resolves to the list of item types.
   */
  itemTypes(category?: string) {
    const q = category ? `?category=${encodeURIComponent(category)}` : "";
    return fetch(`${this.baseUrl}/item-types${q}`).then(r => r.json());
  }

  /**
   * Retrieve items based on zone ID and item type.
   * @param zoneId - The ID of the zone to filter items.
   * @param itemType - The type of the item to filter items.
   * @returns A promise that resolves to the list of items.
   */
  items(zoneId?: number, itemType?: string) {
    const qs:string[] = [];
    if (zoneId) {
      qs.push(`zoneId=${zoneId}`);
    }
    if (itemType) {
      qs.push(`itemType=${encodeURIComponent(itemType)}`);
    }
    const q = qs.length ? `?${qs.join("&")}` : "";
    return fetch(`${this.baseUrl}/items${q}`).then(r => r.json());
  }

  /**
   * Retrieve subcheck templates based on item type ID.
   * @param itemTypeId - The ID of the item type to filter templates.
   * @returns A promise that resolves to the list of subcheck templates.
   */
  templatesByTypeId(itemTypeId:number) {
    return fetch(`${this.baseUrl}/subcheck-templates?itemTypeId=${itemTypeId}`)
    .then(r => r.json());
  }

  /**
   * Retrieve subcheck templates based on item type label.
   * @param itemTypeLabel - The label of the item type to filter templates.
   * @returns A promise that resolves to the list of subcheck templates.
   */
  templatesByLabel(itemTypeLabel:string) {
    return fetch(`${this.baseUrl}/subcheck-templates/by-label?itemType=${encodeURIComponent(itemTypeLabel)}`)
    .then(r => r.json());
  }

  /**
   * Create a new site.
   * @param siteName - Name of the new site to create.
   * @returns A promise that resolves to the created site.
   */
  createSite(siteName:string) {
    return fetch(`${this.baseUrl}/sites`, {
        method:"POST",
        headers:this.headers(),
        body:JSON.stringify({ siteName })
    }).then(r => r.json());
  }
  
  /**
   * Create a new zone.
   * @param zoneName - Name of the new zone to create.
   * @param zoneDescription - Optional description of the new zone.
   * @param siteId - ID of the site to which the zone belongs.
   * @returns A promise that resolves to the created zone.
   */

  createZone (siteId: number, zoneName: string, zoneDescription?: string) {
    return fetch(`${this.baseUrl}/zones`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ siteId, zoneName, zoneDescription}),
    }).then(r => r.json());
  }

  /**
   * Create a new item.
   * @param zoneId - ID of the zone to which the item belongs.
   * @param itemType - Type of the item.
   * @param itemName - Name of the new item to create.
   * @param itemDescription - Optional description of the new item.
   * @returns A promise that resolves to the created item.
   */

  

  // --- inspections ---
  /**
   * Create a new inspection.
   * @param inspectionData - The data for the new inspection.
   * @returns A promise that resolves to the created inspection.
   */
  createInspection(inspectionData:any) {
    return fetch(`${this.baseUrl}/inspections`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(inspectionData),
    }).then(r => r.json());
  }

  /**
   * Retrieve an inspection by ID.
   * @param id - The ID of the inspection to retrieve.
   * @returns A promise that resolves to the inspection data.
   */
  getInspection(id:number) {
    return fetch(`${this.baseUrl}/inspections/${id}`)
    .then(r => r.json());
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
