
using Microsoft.EntityFrameworkCore;
using PolicyDemo.Data;
using PolicyDemo.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure an in-memory EF Core database for demo purposes.
// In production this would be replaced with a persistent provider.
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("PolicyDb"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services for DI: the policy service implements business logic.
// Scoped lifetime is appropriate for DbContext-backed services.
builder.Services.AddScoped<IPolicyService, PolicyService>();

var app = builder.Build();

// Seed sample data on startup to populate the in-memory database.
// It creates a scope to resolve the DbContext and call the Seed helper.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Seed();
}

if (app.Environment.IsDevelopment())
{
    // Expose Swagger UI in development to explore the API interactively.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static UI files from wwwroot (index.html contains the in-browser React demo).
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.Run();
