# maintenance-forms-app-prototype

Prototype for TM470 Maintenance Forms App built in React Native

Overview

The Maintenance Forms App Prototype is a digital inspection system developed to replace paper-based routine maintenance checks in a factory setting.

The application is designed as a three-tier architecture:

Frontend (React Native + TypeScript) – tablet-friendly interface for engineers and managers.

Backend (Express.js API) – business logic layer providing endpoints for authentication, inspections, and attachments.

Database (SQLite prototype → SQL Server planned) – relational schema for inspections, subchecks, results, users, and attachments.

This prototype supports:

Engineer login and role-based access.

Facilities and machine safety inspections.

Dynamic checklists driven by database values.

Recording results as Boolean, numeric, or status inputs.

Automatic calculation of pass/fail outcomes.

Optional comments per subcheck.

Attachments (backend schema implemented, frontend pending).

Features

🔐 User Management – engineers, managers, and admins (future) with role-based permissions.

🏭 Site & Zone Selection – inspections linked to sites and zones for traceability.

📝 Dynamic Forms – inspection templates loaded from database rather than hard-coded.

📊 Result Tracking – auto-calculated inspection outcomes with timestamps and audit history.

📷 Attachments – backend-ready support for photo/document uploads.

⚡ Offline Capability (planned) – saving inspections locally before syncing to the server.

📑 Reports (future) – manager review screens and export to PDF/Excel.

Project Structure
maintenance-forms-app-prototype/
│
├── app/                 # React Native frontend (UI + logic)
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens (login, inspection forms, review)
│   ├── services/        # Frontend API calls
│   ├── styles/          # Global styles
│   └── App.tsx          # Entry point
│
├── app_service/         # Backend (Express.js API)
│   ├── routes/          # Route definitions (users, inspections, attachments)
│   ├── models/          # Data models (SQLite/SQL Server schema)
│   ├── controllers/     # Business logic
│   └── server.ts        # Backend entry point
│
├── data-layer/          # Database configuration + migrations
│   └── migrate.ts
│
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation

Installation
Prerequisites

Node.js (>= 18)

npm or yarn

Expo CLI (for running the React Native frontend)

SQLite (for prototype testing)

SQL Server (planned for production)

Setup

Clone the repository:

git clone https://github.com/yourusername/maintenance-forms-app-prototype.git
cd maintenance-forms-app-prototype


Install dependencies:

npm install


Setup the database:

cd data-layer
ts-node migrate.ts


Run the backend service:

cd app_service
npm run dev


Start the frontend:

cd app
npm start


Scan the QR code with Expo Go (Android/iOS) or run in an emulator.

Usage

Log in with your engineer account.

Select a site and zone.

Choose inspection type (Facility or Machine Safety).

Complete checklist items (boolean/numeric/status).

Add optional comments and attachments (attachments backend only for now).

Submit inspection → results saved to database.

Managers (role-based) can later review results.

Technology Stack

Frontend: React Native, TypeScript, Expo

Backend: Node.js, Express.js

Database: SQLite (prototype), SQL Server (target)

Testing: Jest (frontend), Supertest (backend API)

Future Enhancements

Photo attachments in frontend (camera/gallery integration).

Manager review dashboards.

PDF/Excel export for audits.

Offline mode with local caching and sync.

Notifications for failed critical checks.

Compliance Notes

GDPR: personal data is role-restricted and designed with storage limitation principles.

PUWER 1998: inspection templates align with regulatory requirements for safe equipment use.

License

This project is developed as part of an academic submission (Open University TM470). Not intended for production use.
