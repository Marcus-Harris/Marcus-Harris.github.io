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

        //    protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        //    {
        //        builder.Properties<DateOnly>()
        //            .HaveConversion<DateOnlyConverter, DateOnlyComparer>()
        //            .HaveColumnType("date");

        //        builder.Properties<DateOnly?>()
        //            .HaveConversion<NullableDateOnlyConverter, NullableDateOnlyComparer>()
        //            .HaveColumnType("date");
        //    }
        //}

        //public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
        //{
        //    /// <summary>
        //    /// Creates a new instance of this converter.
        //    /// </summary>
        //    public DateOnlyConverter() : base(
        //            d => d.ToDateTime(TimeOnly.MinValue),
        //            d => DateOnly.FromDateTime(d))
        //    { }
        //}

        //public class DateOnlyComparer : ValueComparer<DateOnly>
        //{
        //    /// <summary>
        //    /// Creates a new instance of this converter.
        //    /// </summary>
        //    public DateOnlyComparer() : base(
        //        (d1, d2) => d1 == d2 && d1.DayNumber == d2.DayNumber,
        //        d => d.GetHashCode())
        //    {
        //    }
        //}

        //public class NullableDateOnlyConverter : ValueConverter<DateOnly?, DateTime?>
        //{
        //    /// <summary>
        //    /// Creates a new instance of this converter.
        //    /// </summary>
        //    public NullableDateOnlyConverter() : base(
        //        d => d == null
        //            ? null
        //            : new DateTime?(d.Value.ToDateTime(TimeOnly.MinValue)),
        //        d => d == null
        //            ? null
        //            : new DateOnly?(DateOnly.FromDateTime(d.Value)))
        //    { }
        //}

        //public class NullableDateOnlyComparer : ValueComparer<DateOnly?>
        //{
        //    /// <summary>
        //    /// Creates a new instance of this converter.
        //    /// </summary>
        //    public NullableDateOnlyComparer() : base(
        //        (d1, d2) => d1 == d2 && d1.GetValueOrDefault().DayNumber == d2.GetValueOrDefault().DayNumber,
        //        d => d.GetHashCode())
        //    {
        //    }
        //}
    }
}
