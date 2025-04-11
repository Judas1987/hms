using AutoMapper;
using HealthManagementSystem.Controllers;
using HealthManagementSystem.Data;
using HealthManagementSystem.Dtos;
using HealthManagementSystem.Mappings;
using HealthManagementSystem.Models;
using HealthManagementSystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System.Dynamic;
using System.Text.Json;

namespace HealthDashboard.Tests;

public class PatientsControllerTestsMock
{
    private readonly PatientsController _controller;
    private readonly Mock<ILogger<PatientsController>> _loggerMock = new();
    private readonly Mock<IPatientRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;

    public PatientsControllerTestsMock()
    {
        _mockRepo = new Mock<IPatientRepository>();
        _mockMapper = new Mock<IMapper>();
        _controller = new PatientsController(_mockRepo.Object, _mockMapper.Object, _loggerMock.Object);
    }

    [Theory]
    [InlineData("Juan", 1)]
    [InlineData("Pedro", 0)]
    [InlineData("", 2)]
    public async Task GetPatients_FilterByName_ReturnsExpectedCount(string nameFilter, int expectedCount)
    {
        
        _mockRepo.Setup(r => r.SearchAsync(nameFilter, 1, 10))
            .ReturnsAsync((GetSamplePatients(nameFilter), expectedCount));
        _mockMapper.Setup(m => m.Map< List<PatientDto>>(It.IsAny<IEnumerable<Patient>>()))
                   .Returns(GetSamplePatientsDto(nameFilter));


        var result = await _controller.GetPatients(nameFilter, 1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(okResult.Value);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        var items = root.GetProperty("items");

        Assert.Equal(expectedCount, items.GetArrayLength());
    }

    [Fact]
    public async Task GetPatients_ReturnsPatients()
    {
        _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(GetSamplePatients(null));

        _mockMapper.Setup(m => m.Map<List<PatientDto>>(It.IsAny<IEnumerable<Patient>>()))
                   .Returns(new List<PatientDto> { new PatientDto { Id = 1, Name = "Juan Pérez" }, new PatientDto { Id = 2, Name = "Ana Gómez" } });

        var result = await _controller.GetPatients(null, 1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(okResult.Value);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        var items = root.GetProperty("items");

        Assert.Equal(JsonValueKind.Array, items.ValueKind);
        Assert.Equal(2, items.GetArrayLength());

        var name = items[0].GetProperty("Name").GetString();
        Assert.Equal("Juan Pérez", name);
    }

    [Fact]
    public async Task GetPatientById_ReturnsCorrectPatient()
    {
        var samplePatient = GetSamplePatients(null).First();
        _mockRepo.Setup(r => r.GetByIdWithDetailsAsync(samplePatient.Id))
            .ReturnsAsync(samplePatient);
        _mockMapper.Setup(m => m.Map<PatientDto>(It.IsAny<Patient>()))
                   .Returns((Patient p) => new PatientDto { Id = p.Id, Name = p.Name });
        var result = await _controller.Get(samplePatient.Id);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<PatientDto>(okResult.Value);

        Assert.Equal(samplePatient.Name, dto.Name);
    }

    // Helper method
    private List<Patient> GetSamplePatients(string? filter)
    {
        var patients = new List<Patient>
    {
        new Patient { Id = 1, Name = "Juan Pérez" },
        new Patient { Id = 2, Name = "Ana Gómez" }
    };

        if (string.IsNullOrWhiteSpace(filter))
            return patients;

        return patients.Where(p => p.Name.Contains(filter)).ToList();
    }

        private List<PatientDto> GetSamplePatientsDto(string? filter)
        {
            var patients = new List<PatientDto>
    {
        new PatientDto { Id = 1, Name = "Juan Pérez" },
        new PatientDto { Id = 2, Name = "Ana Gómez" }
    };

            if (string.IsNullOrWhiteSpace(filter))
                return patients;

            return patients.Where(p => p.Name.Contains(filter)).ToList();
        }

    }
