This is a fullstack authentication practice project built with **Angular** (frontend) and **.NET** (backend). It includes basic login, registration, JWT token handling, and role-based access control. It also supports **mock mode** for frontend-only demos without a backend.

## 🛠️ Tech Stack

- **Frontend:** Angular 16+  
- **Backend:** ASP.NET Core Web API  
- **Database:** SQL Server (or mock with JSON)  
- **Auth:** JWT, role-based access  
- **Password:** Hashed using BCrypt

## 📦 Features

- ✅ Register with username, email, password, role, and mobile number  
- ✅ Login with JWT token generation  
- ✅ Password hashing using `BCrypt.Net`  
- ✅ Store token in `localStorage` (configurable)  
- ✅ AuthGuard to protect routes and check token expiration  
- ✅ Role-based access (e.g., admin can access `/user-list`)  
- ✅ Switch between **real API** and **mock JSON** mode for testing  
- ✅ Auto logout on token expiry  
- ✅ Angular routing with access control

## 📁 Folder Structure

### Angular Frontend (`/src/app`)
core/
└── services/
└── guards/
pages/
└── login/
└── register/
└── home/
└── user-list/
assets/
└── users.json <-- for mock mode

### .NET Backend

Controllers/
Models/
Services/
Data/
DTOs/

## 🧪 Mock Mode

You can enable `mock mode` to simulate API responses using local JSON files.

In `login.service.ts`:

```ts
public readonly isMock = true;

Then provide your mock user data in assets/users.json.

🚀 Getting Started
Backend (.NET)
bash
Copy
Edit
cd BackendProject
dotnet restore
dotnet run
Frontend (Angular)
bash
Copy
Edit
cd frontend
npm install
ng serve
Navigate to: http://localhost:4200

📌 Sample Users (Mock Mode)
json
Copy
Edit
[
  {
    "email": "admin@mail.com",
    "password": "admin123",
    "fullName": "Admin User",
    "role": "admin"
  },
  {
    "email": "user@mail.com",
    "password": "user123",
    "fullName": "Normal User",
    "role": "user"
  }
]
📷 Screenshots
Login page → Protected Home → Admin-only page
(Add screenshots if available)

📝 License
This project is for learning and personal development purposes.
