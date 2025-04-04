using HealthManagementSystem.Models;
using Microsoft.AspNetCore.Identity;

namespace HealthManagementSystem.Data
{
    public class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            await SeedRolesAsync(roleManager);
            await SeedUsersAsync(userManager);
            await SeedPatientsAsync(dbContext);
            await SeedAppointmentsAndPrescriptionsAsync(dbContext);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "Doctor", "Patient" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        private static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager)
        {
            var users = new[]
            {
            new { Email = "admin@hms.com", Password = "Admin123!", Role = "Admin" },
            new { Email = "doctor@hms.com", Password = "Doctor123!", Role = "Doctor" },
            new { Email = "patient@hms.com", Password = "Patient123!", Role = "Patient" }
        };

            foreach (var u in users)
            {
                var user = await userManager.FindByEmailAsync(u.Email);
                if (user == null)
                {
                    user = new ApplicationUser { UserName = u.Email, Email = u.Email };
                    var result = await userManager.CreateAsync(user, u.Password);
                    if (result.Succeeded)
                        await userManager.AddToRoleAsync(user, u.Role);
                }
                else
                {
                    var existingRoles = await userManager.GetRolesAsync(user);
                    if (!existingRoles.Contains(u.Role))
                        await userManager.AddToRoleAsync(user, u.Role);
                }
            }
        }

        private static async Task SeedPatientsAsync(ApplicationDbContext db)
        {
            if (db.Patients.Any()) return;

            var patients = new List<Patient>
        {
            new() { Name = "Juan Pérez", DateOfBirth = new(1990, 5, 12), Gender = "Male", ContactInfo = "juan@example.com", MedicalHistory = "Diabetes tipo 2" },
            new() { Name = "María Gómez", DateOfBirth = new(1985, 3, 22), Gender = "Female", ContactInfo = "patient@hms.com", MedicalHistory = "Asma crónica" }
        };

            db.Patients.AddRange(patients);
            await db.SaveChangesAsync();
        }

        private static async Task SeedAppointmentsAndPrescriptionsAsync(ApplicationDbContext db)
        {
            if (db.Appointments.Any() || db.Prescriptions.Any()) return;

            var patient = db.Patients.FirstOrDefault();
            if (patient == null) return;

            var doctor = "Dr. House";

            db.Appointments.AddRange(new[]
            {
            new Appointment
            {
                PatientId = patient.Id,
                Doctor = doctor,
                Date = DateTime.Today.AddDays(1),
                Time = "10:00 AM",
                Status = "Scheduled"
            },
            new Appointment
            {
                PatientId = patient.Id,
                Doctor = doctor,
                Date = DateTime.Today.AddDays(-3),
                Time = "3:00 PM",
                Status = "Completed"
            }
        });

            db.Prescriptions.Add(new Prescription
            {
                PatientId = patient.Id,
                PrescribingDoctor = doctor,
                Medication = "Paracetamol",
                Dosage = "500mg",
                Frequency = "Cada 8 horas",
                Date = DateTime.Today
            });

            await db.SaveChangesAsync();
        }


    }
}
