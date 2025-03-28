namespace HealthManagementSystem.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string Time { get; set; }

        public string Doctor { get; set; }

        public int PatientId { get; set; }

        public string Status { get; set; } // Scheduled, Completed, Cancelled

        public Patient Patient { get; set; }
    }
}
