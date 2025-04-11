using HealthManagementSystem.Models;

namespace HealthManagementSystem.Repositories.Interfaces
{
    public interface IPatientRepository : IRepository<Patient>
    {
        Task<(IEnumerable<Patient>, int)> SearchAsync(string? name, int page, int pageSize);
        Task<Patient?> GetByIdWithDetailsAsync(int id);
    }
}
