using Microsoft.AspNetCore.Identity;

namespace HealthManagementSystem.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? Role { get; set; } // Admin, Doctor, Patient
    }
}
