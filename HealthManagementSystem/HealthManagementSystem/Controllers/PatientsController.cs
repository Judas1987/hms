using AutoMapper;
using HealthManagementSystem.Data;
using HealthManagementSystem.Dtos;
using HealthManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<PatientsController> _logger;

        public PatientsController(ApplicationDbContext context, IMapper mapper, ILogger<PatientsController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients(
    [FromQuery] string? name,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
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

            return Ok(new
            {
                items = _mapper.Map<List<PatientDto>>(items),
                totalCount
            });
        }



        // GET /api/patients/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.Appointments)
                .Include(p => p.Prescriptions)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound();
            var dto = _mapper.Map<PatientDto>(patient);
            return Ok(dto);
        }

        // POST /api/patients
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePatientDto patientDto)
        {
            var patient = _mapper.Map<Patient>(patientDto);
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = patient.Id }, _mapper.Map<PatientDto>(patient));
        }

        // PUT /api/patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto dto)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _mapper.Map(dto, patient);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
