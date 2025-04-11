using System.ComponentModel.DataAnnotations;

namespace HealthManagementSystem.Dtos
{
    public class UpdatePatientDto
    {
        [Required] public string Name { get; set; } = "";
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string Gender { get; set; } = "";
        public string ContactInfo { get; set; } = "";
        public string MedicalHistory { get; set; } = "";
    }
}
