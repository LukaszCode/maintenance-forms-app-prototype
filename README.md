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

