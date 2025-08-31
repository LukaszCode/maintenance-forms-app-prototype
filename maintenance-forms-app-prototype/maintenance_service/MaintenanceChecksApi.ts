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
