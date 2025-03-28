using AutoMapper;
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
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AppointmentsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("by-patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetByPatient(int patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<AppointmentDto>>(appointments));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<AppointmentDto>> Create(CreateAppointmentDto dto)
        {
            var appointment = _mapper.Map<Appointment>(dto);
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByPatient), new { patientId = appointment.PatientId }, _mapper.Map<AppointmentDto>(appointment));
        }

        [Authorize(Roles = "Admin,Doctor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateAppointmentDto dto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            _mapper.Map(dto, appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
