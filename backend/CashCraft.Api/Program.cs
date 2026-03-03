using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "CashCraft API", Version = "v1" });
    var jwtScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'"
    };
    options.AddSecurityDefinition("Bearer", jwtScheme);
    options.AddSecurityRequirement(new()
    {
        {
            jwtScheme, new string[] { }
        }
    });
});

// MVC Controllers
builder.Services.AddControllers();

// Auth
var jwtKey = builder.Configuration["Jwt:Key"] ?? "dev_secret_key_change_me";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CashCraft";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero, // No clock skew for development
        ValidIssuer = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

// CORS for frontend
const string CorsPolicyName = "Frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// DbContext - Support both SQL Server and PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("Default") ??
                       "Server=(localdb)\\MSSQLLocalDB;Database=CashCraft;Trusted_Connection=True;MultipleActiveResultSets=true";

// Detect database provider from connection string
var usePostgres = connectionString.Contains("Host=") || connectionString.Contains("host=");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (usePostgres)
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Root and health endpoints
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/health", () => Results.Ok("OK"));

// Map controllers
app.UseCors(CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Add test data on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Create admin user
    await CashCraft.Api.AddAdminUser.CreateAdminAccount(context);
    
    // Add test budget data
    await CashCraft.Api.AddTestData.AddTestBudgetData(context);
    
    // Add sample educational content (articles, videos, quizzes)
    await CashCraft.Api.AddSampleContent.AddSampleEducationalContent(context);
}

app.Run();

// removed demo WeatherForecast
