# Maintenance Forms App Prototype  

## Overview  
The **Maintenance Forms App Prototype** is a digital inspection system developed to replace paper-based routine maintenance checks in a factory setting.  

The application is designed as a three-tier architecture:  

- **Frontend (React Native + TypeScript)** – tablet-friendly interface for engineers and managers.  
- **Backend (Express.js API)** – business logic layer providing endpoints for authentication, inspections, and attachments.  
- **Database (SQLite prototype → SQL Server planned)** – relational schema for inspections, subchecks, results, users, and attachments.  

This prototype supports:  
- Engineer login and role-based access.  
- Facilities and machine safety inspections.  
- Dynamic checklists driven by database values.  
- Recording results as Boolean, numeric, or status inputs.  
- Automatic calculation of pass/fail outcomes.  
- Optional comments per subcheck.  
- Attachments (backend schema implemented, frontend pending).  

---

## Features  
- 🔐 **User Management** – engineers, managers, and admins (future) with role-based permissions.  
- 🏭 **Site & Zone Selection** – inspections linked to sites and zones for traceability.  
- 📝 **Dynamic Forms** – inspection templates loaded from database rather than hard-coded.  
- 📊 **Result Tracking** – auto-calculated inspection outcomes with timestamps and audit history.  
- 📷 **Attachments** – backend-ready support for photo/document uploads.  
- ⚡ **Offline Capability (planned)** – saving inspections locally before syncing to the server.  
- 📑 **Reports (future)** – manager review screens and export to PDF/Excel.  

---

## Project Structure  

<img width="504" height="537" alt="image" src="https://github.com/user-attachments/assets/f47544d5-20ec-4427-905c-cd27b36c14a7" />

---

## Installation  

### Prerequisites  
- Node.js (>= 18)  
- npm or yarn  
- Expo CLI (for running the React Native frontend)  
- SQLite (for prototype testing)  
- SQL Server (planned for production)  

### Setup  

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/maintenance-forms-app-prototype.git
   cd maintenance-forms-app-prototype

2. Install dependencies
   ```bash
   npm install
   
4. Set up the database
   ```bash
   cd data-layer
   ts-node migrate.ts

6. Run the backend service
   ```bash
   cd app_service
   npm run dev

8. Start the frontend
   ```bash
   cd app
   npm start

10. Scan the QR code with Expo Go or run in an emulator

### API Base URL configuration

The React Native frontend reads its backend base URL from the Expo configuration (`extra.apiBaseUrl`). A local fallback of `http://192.168.0.6:3001` is defined in `maintenance_app/app.json`, but you should override it per environment by setting the `EXPO_PUBLIC_API_BASE_URL` environment variable before building or starting the app.

- **Expo Go / local development** – create an env file such as `.env.local` that contains `EXPO_PUBLIC_API_BASE_URL=http://<your-local-ip>:3001` and run `npx expo start --env-file .env.local`. You can also prefix the command directly, for example `EXPO_PUBLIC_API_BASE_URL=http://192.168.0.6:3001 npx expo start`.
- **EAS builds** – define the variable in `eas.json` under the `env` key for each build profile or create a secret with `eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value https://api.example.com --scope project` so that the value is injected during the build.
- **Production releases / CI** – ensure your build or update pipeline exports the variable before invoking Expo commands, e.g. `EXPO_PUBLIC_API_BASE_URL=https://api.example.com eas build --profile production` or by configuring the variable in your hosting provider's environment settings.

If the default development host changes, update the fallback inside `maintenance_app/app.json` (and keep `maintenance_app/app.config.ts` aligned) so that contributors without custom environment variables can still run the project.

## Usage

- Log in with your engineer account.
- Select a site and zone.
- Choose inspection type (Facility or Machine Safety).
- Complete checklist items (boolean/numeric/status).
- Add optional comments and attachments (attachments backend only for now).
- Submit inspection → results saved to database.
- Managers (role-based) can later review results.

## Technology Stack
- Frontend: React Native, TypeScript, Expo
- Backend: Node.js, Express.js
- Database: SQLite (prototype), SQL Server (target)
- Testing: Jest (frontend), Supertest (backend API)

## Future Enhancements

- Photo attachments in frontend (camera/gallery integration).
- Manager review dashboards.
- PDF/Excel export for audits.
- Offline mode with local caching and sync.
- Notifications for failed critical checks.

## Compliance Notes

- GDPR: personal data is role-restricted and designed with storage limitation principles.
- PUWER 1998: inspection templates align with regulatory requirements for safe equipment use.

## License
This project is developed as part of an academic submission (Open University TM470).
Not intended for production use.
    
