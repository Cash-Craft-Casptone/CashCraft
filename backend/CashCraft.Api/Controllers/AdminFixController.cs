using System;
using System.Threading.Tasks;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminFixController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public AdminFixController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("fix-admin-role")]
        public async Task<IActionResult> FixAdminRole()
        {
            try
            {
                var admin = await _db.Users.FirstOrDefaultAsync(u => u.Email == "admin@123");
                
                if (admin == null)
                {
                    return NotFound(new { message = "Admin user not found" });
                }

                Console.WriteLine($"Current role: {admin.Role}");
                admin.Role = "Admin";
                admin.IsPremium = true;
                
                await _db.SaveChangesAsync();
                
                Console.WriteLine($"Updated role to: {admin.Role}");
                
                return Ok(new 
                { 
                    message = "Admin role updated successfully",
                    email = admin.Email,
                    role = admin.Role,
                    isPremium = admin.IsPremium
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update admin role", error = ex.Message });
            }
        }

        [HttpGet("check-admin")]
        public async Task<IActionResult> CheckAdmin()
        {
            try
            {
                var admin = await _db.Users.FirstOrDefaultAsync(u => u.Email == "admin@123");
                
                if (admin == null)
                {
                    return NotFound(new { message = "Admin user not found" });
                }

                return Ok(new 
                { 
                    email = admin.Email,
                    username = admin.Username,
                    displayName = admin.DisplayName,
                    role = admin.Role,
                    isPremium = admin.IsPremium,
                    createdAt = admin.CreatedAt
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to check admin", error = ex.Message });
            }
        }
    }
}
