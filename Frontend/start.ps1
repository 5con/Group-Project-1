try {
    python -m http.server 8000
} catch {
    # If Python fails, try .NET
    try {
        dotnet tool install --global dotnet-serve
        dotnet serve -p 8000
    } catch {
        exit 1
    }
}