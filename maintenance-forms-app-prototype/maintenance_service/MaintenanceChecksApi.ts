import { json } from "stream/consumers";

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
