# 🚀 Vercel PostgreSQL Setup for Split-Wise

Since you already have PostgreSQL environment variables configured on Vercel, here's how to set up your Split-Wise app:

## ✅ **Current Status**

Your app is already configured to use:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPLIT_DOMAINS` - Authentication domains
- `REPL_ID` - Replit project ID
- `NODE_ENV` - Environment (production)

## 🗄️ **Database Schema Setup**

### Step 1: Generate and Push Schema

Since you have the `DATABASE_URL` already configured, you need to set up the database schema:

```bash
# Generate migration files
npx drizzle-kit generate

# Push schema to your Vercel PostgreSQL database
npx drizzle-kit push
```

### Step 2: Verify Schema Creation

Your database should now have these tables:
- `users` - User profiles and authentication
- `groups` - Expense groups
- `group_members` - Group membership relationships
- `expenses` - Individual expenses
- `expense_splits` - How expenses are split among users
- `settlements` - Payment settlements between users
- `sessions` - User session storage

## 🔧 **Environment Variables Check**

Make sure these are set in your Vercel dashboard:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings > Environment Variables**
4. **Verify these variables exist:**

```env
# Database (should already exist)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Session (generate if not exists)
SESSION_SECRET=your-super-secret-session-key-here

# Authentication (update with your domain)
REPLIT_DOMAINS=your-vercel-domain.vercel.app
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc

# Environment
NODE_ENV=production
```

## 🚀 **Deploy to Vercel**

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Git Push

```bash
# Push your changes to GitHub
git push origin main

# Vercel will automatically deploy from your Git repository
```

## 🧪 **Testing Your Deployment**

### 1. Test Database Connection

Visit your Vercel domain and check if the app loads without database errors.

### 2. Test API Endpoints

```bash
# Test authentication endpoint
curl https://your-domain.vercel.app/api/auth/user

# Should return 401 (Unauthorized) - this is expected for unauthenticated users
```

### 3. Test Application Flow

1. **Visit your app:** `https://your-domain.vercel.app`
2. **Test authentication:** Try logging in
3. **Test expense creation:** Create a group and add expenses
4. **Test expense splitting:** Verify splits are calculated correctly

## 🔍 **Troubleshooting**

### Common Issues:

1. **Database Connection Failed**
   - Check if `DATABASE_URL` is correctly set in Vercel
   - Verify the connection string format
   - Ensure SSL mode is enabled (`?sslmode=require`)

2. **Schema Not Found**
   - Run `npx drizzle-kit push` locally with your `DATABASE_URL`
   - Check if tables were created in your database

3. **Authentication Errors**
   - Verify `SESSION_SECRET` is set
   - Check if `REPLIT_DOMAINS` matches your Vercel domain
   - Ensure `REPL_ID` is correct

### Testing Database Schema:

```bash
# Connect to your database (replace with your actual DATABASE_URL)
psql "your-database-url-here"

# List tables
\dt

# Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## 📊 **Monitoring**

### Vercel Analytics

1. **Enable Vercel Analytics** in your dashboard
2. **Monitor Function Logs** for any errors
3. **Check Performance** metrics

### Database Monitoring

1. **Monitor database connections** in your PostgreSQL provider
2. **Check query performance** if needed
3. **Set up alerts** for connection issues

## 🎯 **Next Steps**

1. **✅ Database is configured** (you have this)
2. **✅ Environment variables are set** (you have this)
3. **🔄 Deploy your application** (follow steps above)
4. **🧪 Test all functionality** (verify everything works)
5. **📊 Set up monitoring** (optional but recommended)

## 🆘 **Need Help?**

If you encounter any issues:

1. **Check Vercel Function Logs** in your dashboard
2. **Verify environment variables** are correctly set
3. **Test database connection** locally first
4. **Check the troubleshooting section** above

Your Split-Wise app should be ready to deploy and use with your existing Vercel PostgreSQL setup!
