try {
    python --version | Out-Null
    Write-Host "Using Python to start server..."
    python -m http.server 8000
} catch {
    # If Python fails, try .NET
    try {
        dotnet --version | Out-Null
        Write-Host "Python not found, using .NET to start server..."
        dotnet serve -p 8000
    } catch {
        Write-Host "Neither Python nor .NET SDK is installed. Please install one of them to run the server."
        exit 1
    }
}