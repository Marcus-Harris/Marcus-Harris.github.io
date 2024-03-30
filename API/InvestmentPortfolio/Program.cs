using InvestmentPortfolio.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options =>
{
  //options.UseSqlServer(
  //connectionString,
  //x => x.UseDateOnlyTimeOnly());
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), x => x.UseDateOnlyTimeOnly());
});
builder.Services.AddCors(options => options.AddPolicy(name: "InvestmentOrigins",
  policy =>
  {
    policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
    policy.WithOrigins("https://marcus-harris.github.io/MyPortfolioApplication/my-portfolio").AllowAnyMethod().AllowAnyHeader();
  }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("InvestmentOrigins");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
