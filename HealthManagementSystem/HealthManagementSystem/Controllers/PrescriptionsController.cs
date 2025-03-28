using HealthManagementSystem.Data;
using HealthManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrescriptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PrescriptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/prescriptions?patientId=1
        [HttpGet]
        public async Task<IActionResult> GetAll(int? patientId)
        {
            var query = _context.Prescriptions.Include(p => p.Patient).AsQueryable();

            if (patientId.HasValue)
                query = query.Where(p => p.PatientId == patientId);

            var prescriptions = await query.ToListAsync();
            return Ok(prescriptions);
        }

        // POST /api/prescriptions
        [HttpPost]
        public async Task<IActionResult> Create(Prescription prescription)
        {
            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();
            return Ok(prescription);
        }
    }

}
