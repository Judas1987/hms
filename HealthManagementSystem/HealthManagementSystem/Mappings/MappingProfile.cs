using AutoMapper;
using HealthManagementSystem.Dtos;
using HealthManagementSystem.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace HealthManagementSystem.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Patient, PatientDto>();
            CreateMap<Appointment, AppointmentDto>();
            CreateMap<Prescription, PrescriptionDto>();
            CreateMap<CreatePatientDto, Patient>();
            CreateMap<UpdatePatientDto, Patient>();
            CreateMap<CreateAppointmentDto, Appointment>();
            CreateMap<UpdateAppointmentDto, Appointment>();
        }
    }
}
