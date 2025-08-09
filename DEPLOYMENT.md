# 🚀 Deployment Guide for Split-Wise App

This guide will help you deploy your Split-Wise app to Vercel or Google App Engine.

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Git** repository set up
3. **Database** (Neon recommended) configured
4. **Environment variables** ready

## 🗄️ Database Setup (Required First)

### Step 1: Create Neon Database

1. **Visit [Neon Console](https://console.neon.tech/)**
2. **Sign up/Login** with GitHub
3. **Create new project:**
   - Project name: `split-wise`
   - Region: Choose closest to your users
   - Click "Create Project"

### Step 2: Get Connection String

1. **In Neon dashboard:**
   - Click your project
   - Go to "Connection Details"
   - Copy the connection string

2. **Format:**
   ```
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   ```

### Step 3: Set Up Schema

```bash
# Set your database URL
export DATABASE_URL="your-neon-connection-string"

# Generate and push schema
npm run db:generate
npm run db:push
```

## 🎯 Vercel Deployment (Recommended)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

### Step 3: Configure Environment Variables

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings > Environment Variables**
4. **Add these variables:**

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
SESSION_SECRET=your-super-secret-session-key-here
REPLIT_DOMAINS=your-vercel-domain.vercel.app
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc
NODE_ENV=production
```

### Step 4: Redeploy

```bash
vercel --prod
```

## ☁️ Google App Engine Deployment

### Step 1: Install Google Cloud SDK

1. **Download from [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)**
2. **Initialize:**
   ```bash
   gcloud init
   ```

### Step 2: Update Port Configuration

The app is already configured for port 8080 in `app.yaml`.

### Step 3: Deploy

```bash
# Deploy to App Engine
gcloud app deploy
```

### Step 4: Set Environment Variables

1. **Go to Google Cloud Console**
2. **App Engine > Settings > Environment Variables**
3. **Add the same variables as Vercel**

## 🔧 Local Development Setup

### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Set environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/splitwise"
export SESSION_SECRET="dev-secret"
export REPLIT_DOMAINS="localhost:5000"
export REPL_ID="dev-repl"
export NODE_ENV="development"

# Start development server
npm run dev
```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL locally**
2. **Create database:**
   ```sql
   CREATE DATABASE splitwise;
   ```
3. **Set environment variables and run:**
   ```bash
   npm run dev
   ```

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Ensure database is accessible
   - Verify SSL mode is correct

2. **Authentication Errors**
   - Check `SESSION_SECRET` is set
   - Verify `REPLIT_DOMAINS` matches your domain
   - Ensure `REPL_ID` is correct

3. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check TypeScript compilation

### Testing Deployment

1. **Test database connection:**
   ```bash
   npm run db:push
   ```

2. **Test API endpoints:**
   ```bash
   curl https://your-domain.vercel.app/api/auth/user
   ```

3. **Check application logs:**
   - Vercel: Dashboard > Functions > View Logs
   - Google App Engine: Console > Logs

## 📊 Monitoring

### Vercel Analytics

1. **Enable Vercel Analytics** in dashboard
2. **Monitor performance** and errors
3. **Set up alerts** for critical issues

### Google App Engine Monitoring

1. **Enable Cloud Monitoring**
2. **Set up dashboards** for key metrics
3. **Configure alerts** for errors

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Next Steps

1. **Test all functionality** in production
2. **Set up monitoring** and alerts
3. **Configure custom domain** (optional)
4. **Set up SSL certificates** (automatic with Vercel)
5. **Monitor performance** and optimize

## 📞 Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Google App Engine:** [cloud.google.com/appengine](https://cloud.google.com/appengine)
- **Neon Database:** [neon.tech/docs](https://neon.tech/docs)

Need help? Check the troubleshooting section or create an issue in your repository!
