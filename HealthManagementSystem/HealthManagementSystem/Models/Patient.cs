using System.ComponentModel.DataAnnotations;

namespace HealthManagementSystem.Models
{
    public class Patient
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string Gender { get; set; }

        public string? ContactInfo { get; set; }

        public string? MedicalHistory { get; set; }

        public ICollection<Appointment> Appointments { get; set; }

        public ICollection<Prescription> Prescriptions { get; set; }
    }
}
