using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvestmentPortfolio.Migrations
{
  /// <inheritdoc />
  public partial class Initial : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "Investments",
          columns: table => new
          {
            ID = table.Column<int>(type: "int", nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
            Ticker = table.Column<string>(type: "nvarchar(max)", nullable: false),
            Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
            Date_Bought = table.Column<DateTime>(type: "datetime2", nullable: false),
            Date_Sold = table.Column<DateTime>(type: "datetime2", nullable: true),
            Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
            Cost = table.Column<double>(type: "float", nullable: false),
            Revenue = table.Column<double>(type: "float", nullable: true),
            Dividends = table.Column<double>(type: "float", nullable: true),
            Net_Profit_Percentage = table.Column<double>(type: "float", nullable: true),
            Net_Profit = table.Column<double>(type: "float", nullable: true)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Investments", x => x.ID);
          });

      migrationBuilder.CreateTable(
          name: "InvestmentTypes",
          columns: table => new
          {
            ID = table.Column<int>(type: "int", nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_InvestmentTypes", x => x.ID);
          });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "Investments");

      migrationBuilder.DropTable(
          name: "InvestmentTypes");

      migrationBuilder.AlterColumn<Guid>(name: "Ticker", table: "dbo.Investments", nullable: true);
    }
  }
}
