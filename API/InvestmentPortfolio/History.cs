namespace InvestmentPortfolio
{
  public class History
  {
    public int ID { get; set; }
    public string Entry { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DateTime Entry_Date { get; set; } = DateTime.Now;
  }
}