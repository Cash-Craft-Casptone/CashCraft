using Microsoft.EntityFrameworkCore;
using CashCraft.Api.Domain.Entities;
using CashCraft.Api.Infrastructure;
using System.Security.Cryptography;
using System.Text;

namespace CashCraft.Api
{
    public class AddAdminUser
    {
        public static async Task CreateAdminAccount(ApplicationDbContext context)
        {
            try
            {
                Console.WriteLine("🔧 Creating admin account...");

                // Check if admin already exists
                var existingAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@123");
                
                if (existingAdmin != null)
                {
                    Console.WriteLine("⚠️  Admin account already exists!");
                    Console.WriteLine($"Email: {existingAdmin.Email}");
                    Console.WriteLine($"Role: {existingAdmin.Role}");
                    
                    // Update role if not admin
                    if (existingAdmin.Role != "Admin")
                    {
                        existingAdmin.Role = "Admin";
                        await context.SaveChangesAsync();
                        Console.WriteLine("✅ Updated existing user to Admin role");
                    }
                    return;
                }

                // Create admin user
                var adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin@123",
                    Username = "admin",
                    DisplayName = "Admin User",
                    PhoneNumber = "1234567890",
                    PasswordHash = HashPassword("admin123"),
                    Role = "Admin",
                    IsPremium = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();

                Console.WriteLine("✅ Admin account created successfully!");
                Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                Console.WriteLine("📧 Email: admin@123");
                Console.WriteLine("🔑 Password: admin123");
                Console.WriteLine("👤 Role: Admin");
                Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                Console.WriteLine("You can now log in with these credentials!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error creating admin account: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }

        private static string HashPassword(string password)
        {
            // PBKDF2 - same as AuthController
            using var pbkdf2 = new Rfc2898DeriveBytes(password, 16, 100, HashAlgorithmName.SHA256);
            var salt = pbkdf2.Salt;
            var hash = pbkdf2.GetBytes(32);
            return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }
    }
}
