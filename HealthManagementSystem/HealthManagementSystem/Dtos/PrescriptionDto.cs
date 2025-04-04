namespace HealthManagementSystem.Dtos
{
    public class PrescriptionDto
    {
        public int PatientId { get; set; }
        public string Medication { get; set; } = "";
        public string Dosage { get; set; } = "";
        public string Frequency { get; set; } = "";
        public string PrescribingDoctor { get; set; } = "";
        public DateTime Date { get; set; }
    }
}
