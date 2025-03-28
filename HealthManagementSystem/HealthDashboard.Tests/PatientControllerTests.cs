using AutoMapper;
using HealthManagementSystem.Controllers;
using HealthManagementSystem.Data;
using HealthManagementSystem.Dtos;
using HealthManagementSystem.Mappings;
using HealthManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System.Dynamic;
using System.Text.Json;

namespace HealthDashboard.Tests;

public class PatientsControllerTests
{
    private readonly PatientsController _controller;
    private readonly Mock<ILogger<PatientsController>> _loggerMock = new();
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public PatientsControllerTests()
    {
        // Mapper config
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();

        // In-memory DB
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);

        // Seed test data
        _context.Patients.AddRange(new[]
{
    new Patient { Name = "Juan Pérez", Gender = "Male" },
    new Patient { Name = "Maria Lopez", Gender = "Female" }
});
        _context.SaveChanges();

        _controller = new PatientsController(_context, _mapper, _loggerMock.Object);
    }

    [Theory]
    [InlineData("Juan", 1)]
    [InlineData("Pedro", 0)]
    [InlineData("", 2)]
    public async Task GetPatients_FilterByName_ReturnsExpectedCount(string nameFilter, int expectedCount)
    {
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
        var patient = _context.Patients.First();
        var result = await _controller.Get(patient.Id);
        var okResult = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<PatientDto>(okResult.Value);

        Assert.Equal(patient.Name, dto.Name);
    }

    

}
