# Backend Dockerfile for .NET 9.0
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CashCraft.Api.csproj", "./"]
RUN dotnet restore "CashCraft.Api.csproj"
COPY . .
RUN dotnet build "CashCraft.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CashCraft.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CashCraft.Api.dll"]
