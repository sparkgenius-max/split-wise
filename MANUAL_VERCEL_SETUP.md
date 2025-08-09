# 🔧 Manual Vercel PostgreSQL Setup

If you're getting the "DATABASE_URL, ensure the database is provisioned" error, follow these steps:

## 🎯 **Step 1: Get Your Vercel DATABASE_URL**

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings > Environment Variables**
4. **Find `DATABASE_URL` and copy its value**

## 🎯 **Step 2: Set Up Database Schema**

### Option A: Using PowerShell Script (Recommended)

```powershell
# Run the setup script with your DATABASE_URL
.\setup-vercel-db.ps1 "your-vercel-postgresql-url-here"
```

### Option B: Manual Setup

```powershell
# Set your Vercel DATABASE_URL
$env:DATABASE_URL="your-vercel-postgresql-url-here"

# Generate migration files
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push
```

### Option C: Using Command Prompt

```cmd
# Set your Vercel DATABASE_URL
set DATABASE_URL=your-vercel-postgresql-url-here

# Generate migration files
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push
```

## 🔍 **Troubleshooting**

### Error: "DATABASE_URL, ensure the database is provisioned"

**Solution:** You need to set the `DATABASE_URL` environment variable before running the commands.

```powershell
# Check if DATABASE_URL is set
echo $env:DATABASE_URL

# If it's empty or shows localhost, you need to set it to your Vercel URL
$env:DATABASE_URL="your-vercel-postgresql-url-here"
```

### Error: "Connection refused" or "Authentication failed"

**Solution:** Check your DATABASE_URL format:

```bash
# Correct format:
postgresql://username:password@host:port/database?sslmode=require

# Example:
postgresql://user123:pass456@db.vercel.com:5432/splitwise?sslmode=require
```

### Error: "SSL connection required"

**Solution:** Make sure your DATABASE_URL includes `?sslmode=require` at the end.

## 🚀 **Quick Test**

After setting up the database schema:

1. **Test database connection:**
   ```bash
   # This should work without errors
   npx drizzle-kit push
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Test your app:**
   - Visit your Vercel domain
   - Check if the app loads without database errors

## 📞 **Need Help?**

If you're still having issues:

1. **Check Vercel Function Logs** in your dashboard
2. **Verify DATABASE_URL format** is correct
3. **Test connection** with a database client
4. **Check if your database allows external connections**

## 🎯 **Next Steps**

Once your database schema is set up:

1. ✅ **Database configured** - Schema is pushed
2. 🔄 **Deploy to Vercel** - `vercel --prod`
3. 🧪 **Test functionality** - Verify everything works
4. 📊 **Monitor performance** - Check Vercel analytics

Your Split-Wise app should be ready to use! 🎉
