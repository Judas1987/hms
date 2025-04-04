using HealthManagementSystem.Data;
using HealthManagementSystem.Models;
using HealthManagementSystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace HealthManagementSystem.Repositories.Implementations
{
    public class PatientRepository : Repository<Patient>, IPatientRepository
    {
        private readonly IMemoryCache _cache;
        public PatientRepository(ApplicationDbContext context, IMemoryCache cache) : base(context)
        {
            _cache = cache;
        }

        public async Task<Patient?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Patients
                .Include(p => p.Appointments)
                .Include(p => p.Prescriptions)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<(IEnumerable<Patient>, int)> SearchAsync(string? name, int page, int pageSize)
        {
            string cacheKey = $"patients:name={name ?? ""}:page={page}:pageSize={pageSize}";

            if (_cache.TryGetValue(cacheKey, out (IEnumerable<Patient> data, int count) cachedResult))
            {
                return cachedResult;
            }
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
            var result = (items, totalCount);

            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(1)); // caché por 1 minuto

            return result;
        }

    }
}
