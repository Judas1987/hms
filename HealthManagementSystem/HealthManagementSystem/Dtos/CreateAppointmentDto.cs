using System.ComponentModel.DataAnnotations;

namespace HealthManagementSystem.Dtos
{
    public class CreateAppointmentDto
    {
        [Required] public int PatientId { get; set; }
        [Required] public string Doctor { get; set; } = "";
        [Required] public DateTime Date { get; set; }
        [Required] public string Time { get; set; } = "";
        [Required] public string Status { get; set; } = "Scheduled";
    }
}
