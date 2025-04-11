using AutoMapper;
using HealthManagementSystem.Data;
using HealthManagementSystem.Dtos;
using HealthManagementSystem.Models;
using HealthManagementSystem.Repositories.Implementations;
using HealthManagementSystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientRepository _patientRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<PatientsController> _logger;

        public PatientsController(IPatientRepository patientRepo, IMapper mapper, ILogger<PatientsController> logger)
        {
            _patientRepository = patientRepo;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients(
    [FromQuery] string? name,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var (patients, totalCount) = await _patientRepository.SearchAsync(name, page, pageSize);

            return Ok(new
            {
                items = _mapper.Map<List<PatientDto>>(patients),
                totalCount
            });
        }



        // GET /api/patients/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var patient = await _patientRepository.GetByIdWithDetailsAsync(id);
            if (patient == null) return NotFound();

            var dto = _mapper.Map<PatientDto>(patient);
            return Ok(dto);
        }

        // POST /api/patients
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePatientDto patientDto)
        {
            var patient = _mapper.Map<Patient>(patientDto);
            await _patientRepository.AddAsync(patient);
            await _patientRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = patient.Id }, _mapper.Map<PatientDto>(patient));
        }

        // PUT /api/patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePatientDto dto)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null) return NotFound();

            _mapper.Map(dto, patient);

            await _patientRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null) return NotFound();
            _patientRepository.Delete(patient);
            await _patientRepository.SaveChangesAsync();
            return NoContent();
        }
    }
}
