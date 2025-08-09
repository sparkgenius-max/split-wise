# Database Setup Guide for Split-Wise App

## 🎯 **Recommended: Neon Database (PostgreSQL)**

Your app is already configured to use Neon Database, which is perfect for Vercel deployment.

### **Step 1: Create Neon Database**

1. **Visit [Neon Console](https://console.neon.tech/)**
2. **Sign up/Login** with your GitHub account
3. **Create a new project:**
   - Click "Create Project"
   - Choose a project name (e.g., "split-wise")
   - Select a region close to your users
   - Click "Create Project"

### **Step 2: Get Database Connection String**

1. **In your Neon project dashboard:**
   - Click on your project
   - Go to "Connection Details" tab
   - Copy the "Connection string" (starts with `postgresql://`)

2. **Connection string format:**
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   ```

### **Step 3: Set Up Database Schema**

1. **Install Drizzle CLI globally:**
   ```bash
   npm install -g drizzle-kit
   ```

2. **Generate and run migrations:**
   ```bash
   # Generate migration files
   npx drizzle-kit generate
   
   # Push schema to database
   npx drizzle-kit push
   ```

### **Step 4: Environment Variables**

Set these environment variables in your deployment platform:

```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Session (generate a random string)
SESSION_SECRET=your-super-secret-session-key-here

# Authentication (for production)
REPLIT_DOMAINS=your-domain.com
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc

# Server
PORT=5000
NODE_ENV=production
```

## 🚀 **Vercel Deployment**

### **Step 1: Prepare for Vercel**

1. **Create `vercel.json` in your project root:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "server/index.ts"
       }
     ]
   }
   ```

2. **Update `package.json` scripts:**
   ```json
   {
     "scripts": {
       "dev": "tsx server/index.ts",
       "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
       "start": "node dist/index.js",
       "vercel-build": "npm run build"
     }
   }
   ```

### **Step 2: Deploy to Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add all the environment variables from Step 4 above

## ☁️ **Google App Engine Deployment**

### **Step 1: Create `app.yaml`**

```yaml
runtime: nodejs20
env: standard

instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10

env_variables:
  NODE_ENV: "production"
  PORT: "8080"

handlers:
  - url: /api/.*
    script: auto
  - url: /.*
    script: auto
```

### **Step 2: Update Server Port**

Update `server/index.ts` to use port 8080 for Google App Engine:

```typescript
const port = parseInt(process.env.PORT || '8080', 10);
```

### **Step 3: Deploy to Google App Engine**

1. **Install Google Cloud SDK**
2. **Initialize project:**
   ```bash
   gcloud init
   ```

3. **Deploy:**
   ```bash
   gcloud app deploy
   ```

## 🔧 **Alternative Database Options**

### **Option 2: Supabase (PostgreSQL)**

1. **Create Supabase project** at [supabase.com](https://supabase.com)
2. **Get connection string** from Settings > Database
3. **Update `server/db.ts`** to use Supabase client if needed

### **Option 3: PlanetScale (MySQL)**

1. **Create PlanetScale database** at [planetscale.com](https://planetscale.com)
2. **Update schema** to use MySQL syntax
3. **Update Drizzle configuration** for MySQL

## 🛠️ **Local Development Setup**

### **Option 1: Local PostgreSQL**

1. **Install PostgreSQL locally**
2. **Create database:**
   ```sql
   CREATE DATABASE splitwise;
   ```

3. **Set environment variable:**
   ```bash
   DATABASE_URL=postgresql://localhost:5432/splitwise
   ```

### **Option 2: Docker PostgreSQL**

1. **Create `docker-compose.yml`:**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: splitwise
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

2. **Run with Docker:**
   ```bash
   docker-compose up -d
   ```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Connection refused:**
   - Check if database is running
   - Verify connection string
   - Ensure SSL mode is correct

2. **Schema not found:**
   - Run `npx drizzle-kit push` to create tables
   - Check if migrations are applied

3. **Authentication errors:**
   - Verify `SESSION_SECRET` is set
   - Check `REPLIT_DOMAINS` configuration

### **Testing Database Connection:**

```bash
# Test connection (replace with your DATABASE_URL)
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

## 📊 **Database Schema Overview**

Your app uses these tables:
- `users` - User profiles and authentication
- `groups` - Expense groups
- `group_members` - Group membership relationships
- `expenses` - Individual expenses
- `expense_splits` - How expenses are split among users
- `settlements` - Payment settlements between users
- `sessions` - User session storage

## 🎯 **Next Steps**

1. **Choose your database provider** (Neon recommended)
2. **Set up the database** following the steps above
3. **Configure environment variables** in your deployment platform
4. **Deploy your application**
5. **Test the functionality** with real data

Need help with any specific step? Let me know!
