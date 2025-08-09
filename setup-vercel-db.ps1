# Vercel PostgreSQL Setup Script for Split-Wise
# Run this script after you have your Vercel DATABASE_URL

Write-Host "🚀 Vercel PostgreSQL Setup for Split-Wise" -ForegroundColor Green
Write-Host ""

# Check if DATABASE_URL is provided as argument
if ($args.Count -eq 0) {
    Write-Host "❌ Please provide your Vercel DATABASE_URL as an argument." -ForegroundColor Red
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-vercel-db.ps1 'your-vercel-postgresql-url-here'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host "  .\setup-vercel-db.ps1 'postgresql://user:password@host/database?sslmode=require'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To get your DATABASE_URL:" -ForegroundColor Yellow
    Write-Host "1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables" -ForegroundColor White
    Write-Host "2. Copy the DATABASE_URL value" -ForegroundColor White
    Write-Host "3. Run this script with that URL" -ForegroundColor White
    exit 1
}

$databaseUrl = $args[0]

# Validate DATABASE_URL format
if ($databaseUrl -notmatch "^postgres") {
    Write-Host "❌ Invalid DATABASE_URL format. It should start with 'postgres' or 'postgresql'" -ForegroundColor Red
    exit 1
}

Write-Host "✅ DATABASE_URL format looks correct" -ForegroundColor Green

# Set environment variable
$env:DATABASE_URL = $databaseUrl

Write-Host ""
Write-Host "📝 Generating migration files..." -ForegroundColor Yellow

# Generate migration files
$generateResult = npx drizzle-kit generate 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate migration files: $generateResult" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Migration files generated successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🗄️  Pushing schema to Vercel PostgreSQL database..." -ForegroundColor Yellow

# Push schema to database
$pushResult = npx drizzle-kit push 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema: $pushResult" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check if your DATABASE_URL is correct" -ForegroundColor White
    Write-Host "2. Ensure your database is accessible" -ForegroundColor White
    Write-Host "3. Verify your network connection" -ForegroundColor White
    Write-Host "4. Check if your database allows external connections" -ForegroundColor White
    exit 1
}

Write-Host "✅ Database schema pushed successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Database setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy to Vercel: vercel --prod" -ForegroundColor White
Write-Host "2. Test your application at your Vercel domain" -ForegroundColor White
Write-Host "3. Verify all functionality works" -ForegroundColor White
Write-Host ""
Write-Host "📊 Your database now has these tables:" -ForegroundColor Cyan
Write-Host "   - users (User profiles and authentication)" -ForegroundColor White
Write-Host "   - groups (Expense groups)" -ForegroundColor White
Write-Host "   - group_members (Group membership relationships)" -ForegroundColor White
Write-Host "   - expenses (Individual expenses)" -ForegroundColor White
Write-Host "   - expense_splits (How expenses are split among users)" -ForegroundColor White
Write-Host "   - settlements (Payment settlements between users)" -ForegroundColor White
Write-Host "   - sessions (User session storage)" -ForegroundColor White
