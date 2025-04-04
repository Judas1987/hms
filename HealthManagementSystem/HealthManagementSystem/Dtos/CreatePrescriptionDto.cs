using System.ComponentModel.DataAnnotations;

namespace HealthManagementSystem.Dtos
{
    public class CreatePRescriptionDto
    {
        
        [Required] public DateTime Date { get; set; }
        public string Medication { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        [Required] public int PatientId { get; set; }
    }
}
