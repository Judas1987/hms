using HealthManagementSystem.Data;
using HealthManagementSystem.Models;
using HealthManagementSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HealthManagementSystem.Repositories.Implementations
{
    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        public PatientRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Patient?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Patients
                .Include(p => p.Appointments)
                .Include(p => p.Prescriptions)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<(IEnumerable<Patient>, int)> SearchAsync(string? name, int page, int pageSize)
        {
            var query = _context.Patients
                .AsNoTracking()
                .OrderBy(p => p.Name)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
                query = query.Where(p => p.Name.Contains(name));

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

    }
}
