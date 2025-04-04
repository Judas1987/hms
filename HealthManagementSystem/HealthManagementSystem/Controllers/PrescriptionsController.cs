using HealthManagementSystem.Data;
using HealthManagementSystem.Dtos;
using HealthManagementSystem.Models;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("by-email/{patientMail}")]
        public async Task<IActionResult> GetAllByMail(string? patientMail)
        {
            var query = _context.Prescriptions.Include(p => p.Patient).AsQueryable();

            if (!string.IsNullOrEmpty(patientMail))
                query = query.Where(p => p.Patient.ContactInfo == patientMail);

            var prescriptions = await query.ToListAsync();
            return Ok(prescriptions);
        }

        // POST /api/prescriptions
        [HttpPost]
        public async Task<IActionResult> Create(PrescriptionDto dto)
        {
            var doctor = User.Identity?.Name ?? dto.PrescribingDoctor;

            var prescription = new Prescription
            {
                Medication = dto.Medication,
                Dosage = dto.Dosage,
                Frequency = dto.Frequency,
                PatientId = dto.PatientId,
                PrescribingDoctor = doctor,
                Date = DateTime.UtcNow
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }

}
