namespace HealthManagementSystem.Dtos
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = "";
        public string ContactInfo { get; set; } = "";
        public string MedicalHistory { get; set; } = "";

        public List<AppointmentDto> Appointments { get; set; } = new();
        public List<PrescriptionDto> Prescriptions { get; set; } = new();
    }

}
