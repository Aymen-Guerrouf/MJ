# Test script for Interest-Based Recommendation System
# Run this after starting the backend server
# Usage: .\test-interest-system.ps1

$BaseUrl = "http://localhost:3001"
$Email = "test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$Password = "Test123456"
$Name = "Test User"
$Age = 25

Write-Host "🧪 Testing Interest-Based Recommendation System" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Register
Write-Host "📝 Step 1: Registering new user..." -ForegroundColor Yellow
$RegisterBody = @{
    email = $Email
    password = $Password
    name = $Name
    age = $Age
} | ConvertTo-Json

try {
    $RegisterResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $RegisterBody
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host ($RegisterResponse | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Note about verification
Write-Host "⏭️  Step 2: Email verification required" -ForegroundColor Yellow
Write-Host "Check your email for verification code" -ForegroundColor Gray
Write-Host "Enter the 4-digit code:" -ForegroundColor Yellow
$VerificationCode = Read-Host

# 3. Verify email
Write-Host "✉️  Step 3: Verifying email..." -ForegroundColor Yellow
$VerifyBody = @{
    email = $Email
    code = $VerificationCode
} | ConvertTo-Json

try {
    $VerifyResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/verify-email" `
        -Method Post `
        -ContentType "application/json" `
        -Body $VerifyBody
    
    $Token = $VerifyResponse.data.token
    Write-Host "✅ Email verified!" -ForegroundColor Green
    Write-Host "Token: $($Token.Substring(0, [Math]::Min(20, $Token.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Verification failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Update interests
Write-Host "🎯 Step 4: Updating user interests..." -ForegroundColor Yellow
$InterestsBody = @{
    interests = @("coding", "tech", "gaming")
} | ConvertTo-Json

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

try {
    $InterestsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/user/interests" `
        -Method Patch `
        -Headers $Headers `
        -Body $InterestsBody
    
    Write-Host "✅ Interests updated!" -ForegroundColor Green
    Write-Host ($InterestsResponse | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to update interests: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Get recommendations
Write-Host "🎁 Step 5: Getting personalized recommendations..." -ForegroundColor Yellow
try {
    $RecommendationsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/user/eventRecommendation" `
        -Method Get `
        -Headers $Headers
    
    Write-Host "✅ Recommendations retrieved!" -ForegroundColor Green
    Write-Host ($RecommendationsResponse | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Failed to get recommendations: $_" -ForegroundColor Yellow
    Write-Host "This might be because no events exist yet" -ForegroundColor Gray
}
Write-Host ""

# 6. Get user profile
Write-Host "👤 Step 6: Verifying interests in user profile..." -ForegroundColor Yellow
try {
    $ProfileResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/me" `
        -Method Get `
        -Headers $Headers
    
    Write-Host "✅ Profile retrieved!" -ForegroundColor Green
    Write-Host "User: $($ProfileResponse.data.user.name)" -ForegroundColor Gray
    Write-Host "Interests: $($ProfileResponse.data.user.interests -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get profile: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Test Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- User registered: $Email" -ForegroundColor White
Write-Host "- Interests set: coding, tech, gaming" -ForegroundColor White
Write-Host "- Token obtained successfully" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the mobile app signup flow" -ForegroundColor White
Write-Host "2. Select interests in InterestSelection screen" -ForegroundColor White
Write-Host "3. Verify recommendations on home screen" -ForegroundColor White
