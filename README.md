# 🏥 Health Management System – Patient Dashboard Module

This is a full-stack web application that enables healthcare providers to view and manage patient health records, appointments, and prescriptions.

---

## 🚀 Tech Stack

- **Backend**: ASP.NET Core 8, EF Core (Code-First), MSSQL, JWT Auth
- **Frontend**: Angular 17+, Angular Material, RxJS, Interceptors, Guards
- **Database**: SQL Server with migrations
- **Auth**: JSON Web Tokens (JWT) with role-based access control

---

## 📦 How to Run the Project

### 🔧 Backend (.NET Core API)

```bash
cd HealthManagementSystem
dotnet ef database update
dotnet run
```

- Swagger UI: `https://localhost:5001/swagger`

> **Default Admin User**
> - Email: `admin@hms.com`
> - Password: `Admin123!`

---

### 💻 Frontend (Angular)

```bash
cd patient-dashboard
npm install
ng serve
```
- App UI: `http://localhost:4200`

---

## 📋 Features

- ✅ Login with role-based access (`Admin`, `Doctor`, `Patient`)
- ✅ Manage Patients (list, add, edit, details)
- ✅ Manage Appointments & Prescriptions
- ✅ Authorization protected by backend & frontend
- ✅ RESTful API with Swagger
- ✅ Responsive dashboard with Angular Material
- ✅ Guards & interceptors for secure routing

---

## 🗂 Folder Structure
```bash
HealthManagementSystem/
│
├── Controllers/         # API Controllers
├── Models/              # Data Models
├── Data/                # EF Core Context & Seeding
├── Migrations/          # EF Core Migrations
├── patient-dashboard/   # Angular Frontend
└── README.md
```

---

## 🗓️ Project Timeline

| Day | Focus                                       |
|-----|---------------------------------------------|
| 1-2 | Backend: DB Design, API, Auth               |
| 3-4 | Frontend: UI, State, Auth                   |
| 5   | Testing: Unit + E2E                         |
| 6   | Optimization + Extras (SignalR, Export)     |
| 7   | Documentation, Cleanup, Final Review        |

---

## 🧠 Design Decisions

- **EF Core (Code-First)** for flexibility and testability.
- **JWT** for stateless, scalable authentication.
- **Standalone Angular Components** (v17+) for modern architecture.
- **Strict Role Enforcement** both backend & frontend.

---

## 📈 Optimizations (Planned)

- 🔄 Real-time updates with SignalR
- 📄 Export to PDF/Excel
- 🔍 Full-text search in MSSQL
- 🐳 Docker support for full stack

---

## 🧪 Testing

- **xUnit** for backend controller logic
- **Jasmine** for Angular unit tests
- **Cypress** for end-to-end tests

---

## 👨‍💻 Author

Angela Valdez
Senior Full Stack Developer – Angular + .NET

