# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001

# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY HealthManagementSystem/*.csproj ./HealthManagementSystem/
RUN dotnet restore ./HealthManagementSystem/HealthManagementSystem.csproj

COPY . .
WORKDIR /src/HealthManagementSystem
RUN dotnet publish -c Release -o /app/publish

# Final
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HealthManagementSystem.dll"]
