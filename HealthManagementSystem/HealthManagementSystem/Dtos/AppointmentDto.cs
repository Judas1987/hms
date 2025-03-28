namespace HealthManagementSystem.Dtos
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public string Doctor { get; set; } = "";
        public DateTime Date { get; set; }
        public string Time { get; set; } = "";
        public string Status { get; set; } = "";
    }
}
