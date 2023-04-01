using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace InvestmentPortfolio.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Investment> Investments => Set<Investment>();
        public DbSet<InvestmentType> InvestmentTypes => Set<InvestmentType>();
    }
}
