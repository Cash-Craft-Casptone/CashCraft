using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CashCraft.Api.Domain.Entities;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public class RegisterRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string DisplayName { get; set; } = string.Empty;
            public string PhoneNumber { get; set; } = string.Empty;
            public string? Role { get; set; } // Optional role parameter
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            try
            {
                var emailExists = await _db.Users.AnyAsync(u => u.Email == req.Email);
                if (emailExists) return Conflict("Email already in use");

                var usernameExists = await _db.Users.AnyAsync(u => u.Username == req.Username);
                if (usernameExists) return Conflict("Username already in use");

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = req.Email,
                    Username = req.Username,
                    DisplayName = req.DisplayName,
                    PhoneNumber = req.PhoneNumber,
                    PasswordHash = HashPassword(req.Password),
                    Role = req.Role ?? "User" // Use provided role or default to "User"
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
                
                var tokens = GenerateSimpleTokens(user);
                return Ok(tokens);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed", error = ex.Message });
            }
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
                if (user == null) 
                {
                    return Unauthorized(new { message = "User not found" });
                }
                
                if (!VerifyPassword(req.Password, user.PasswordHash)) 
                {
                    return Unauthorized(new { message = "Invalid password" });
                }
                
                var tokens = GenerateSimpleTokens(user);
                return Ok(tokens);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Login failed", error = ex.Message });
            }
        }

        public class RefreshRequest
        {
            public string RefreshToken { get; set; } = string.Empty;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest req)
        {
            var tokenHash = Sha256(req.RefreshToken);
            var existing = await _db.RefreshTokens
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.TokenHash == tokenHash && r.RevokedAt == null && r.ExpiresAt > DateTime.UtcNow);
            if (existing == null || existing.User == null) return Unauthorized();

            // rotate
            existing.RevokedAt = DateTime.UtcNow;
            var tokens = IssueTokens(existing.User, HttpContext.Connection.RemoteIpAddress?.ToString(), existing.TokenHash);
            await _db.SaveChangesAsync();
            return Ok(tokens);
        }

        public class LogoutRequest
        {
            public string RefreshToken { get; set; } = string.Empty;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequest req)
        {
            var tokenHash = Sha256(req.RefreshToken);
            var existing = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == tokenHash && r.RevokedAt == null);
            if (existing != null)
            {
                existing.RevokedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
            return Ok();
        }

        public class GoogleAuthRequest
        {
            public string IdToken { get; set; } = string.Empty;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest req)
        {
            try
            {
                // Decode the Google ID token (in production, verify signature with Google's public keys)
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(req.IdToken);
                
                var email = token.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                var name = token.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
                var googleId = token.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
                {
                    return BadRequest("Invalid Google token");
                }
                
                // Check if user exists
                var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
                
                if (user == null)
                {
                    // Create new user from Google account
                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        Email = email,
                        Username = email.Split('@')[0] + "_" + Guid.NewGuid().ToString().Substring(0, 8),
                        DisplayName = name ?? email.Split('@')[0],
                        PhoneNumber = "",
                        PasswordHash = HashPassword(Guid.NewGuid().ToString()), // Random password for Google users
                        Role = "User"
                    };
                    _db.Users.Add(user);
                    await _db.SaveChangesAsync();
                }
                
                var tokens = GenerateSimpleTokens(user);
                return Ok(tokens);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Google authentication failed", error = ex.Message });
            }
        }

        private Task<object> IssueTokens(User user, string? ip, string? replacedTokenHash = null)
        {
            try
            {
                var jwtKey = _config["Jwt:Key"] ?? "dev_secret_key_change_me";
                var jwtIssuer = _config["Jwt:Issuer"] ?? "CashCraft";
                
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                
                var jwt = new JwtSecurityToken(
                    issuer: jwtIssuer,
                    audience: null,
                    claims: new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email),
                        new Claim(ClaimTypes.Role, user.Role)
                    },
                    expires: DateTime.UtcNow.AddDays(7), // Extended to 7 days for development
                    signingCredentials: creds
                );
                
                var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
                var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
                
                var refresh = new RefreshToken
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    TokenHash = Sha256(refreshToken),
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    CreatedByIp = ip,
                    ReplacedByTokenHash = replacedTokenHash
                };
                
                _db.RefreshTokens.Add(refresh);
                
                return Task.FromResult<object>(new { accessToken, refreshToken });
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to issue tokens: {ex.Message}", ex);
            }
        }

        private static string HashPassword(string password)
        {
            // PBKDF2 - extremely fast for development, increase for production
            using var pbkdf2 = new Rfc2898DeriveBytes(password, 16, 100, HashAlgorithmName.SHA256);
            var salt = pbkdf2.Salt;
            var hash = pbkdf2.GetBytes(32);
            return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }

        private static bool VerifyPassword(string password, string stored)
        {
            var parts = stored.Split('.');
            if (parts.Length != 2) return false;
            var salt = Convert.FromBase64String(parts[0]);
            var expected = Convert.FromBase64String(parts[1]);
            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100, HashAlgorithmName.SHA256);
            var actual = pbkdf2.GetBytes(32);
            return CryptographicOperations.FixedTimeEquals(expected, actual);
        }

        private static string Sha256(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes);
        }

        private object GenerateSimpleTokens(User user)
        {
            var jwtKey = _config["Jwt:Key"] ?? "dev_secret_key_change_me";
            var jwtIssuer = _config["Jwt:Issuer"] ?? "CashCraft";
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var jwt = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: null,
                claims: new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("displayName", user.DisplayName),
                    new Claim("username", user.Username),
                    new Claim("isPremium", user.IsPremium.ToString())
                },
                expires: DateTime.UtcNow.AddDays(7), // Extended to 7 days for development
                signingCredentials: creds
            );
            
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            
            return new { accessToken, refreshToken };
        }
    }
}


