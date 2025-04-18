# Fullstack Monorepo: Vite + NestJS

This monorepo contains a Vite (React) frontend and NestJS backend managed with npm workspaces.

## 🚀 Quick Start

1. **Clone the repo**:
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
Install dependencies:

bash
Copy
npm install
Run both apps:

bash
Copy
npm run dev
📁 Project Structure
Copy
monorepo/
├── apps/
│   ├── backend/     # NestJS app (port 3001)
│   └── frontend/    # Vite app (port 5173)
├── package.json
└── README.md
🛠️ Scripts
Command	Description
npm run dev	Runs both frontend (Vite) and backend (NestJS)
npm run build	Builds both apps for production
npm run test	(Placeholder for tests)
🔌 Development
Run Individually
Vite Frontend:

bash
Copy
npm run dev --workspace=apps/frontend
NestJS Backend:

bash
Copy
npm run start:dev --workspace=apps/backend
📦 Dependency Management
Add Dependencies
Vite Frontend:

bash
Copy
npm install <package> --workspace=apps/frontend
NestJS Backend:

bash
Copy
npm install <package> --workspace=apps/backend
Both Apps:

bash
Copy
npm install <package> -w apps/frontend -w apps/backend
🔧 Configuration Changes
If you're migrating from Next.js to Vite, ensure:

Your root package.json scripts are updated:

json
Copy
"dev": "concurrently \"npm run dev --workspace=apps/frontend\" \"npm run start:dev --workspace=apps/backend\"",
"build": "concurrently \"npm run build --workspace=apps/frontend\" \"npm run build --workspace=apps/backend\""
The frontend package.json should have Vite scripts:

json
Copy
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
🚀 Deployment
Vite Frontend
Build: npm run build --workspace=apps/frontend

Deploy the dist folder to your preferred static hosting

NestJS Backend
Build: npm run build --workspace=apps/backend

Deploy the dist folder to your Node.js server