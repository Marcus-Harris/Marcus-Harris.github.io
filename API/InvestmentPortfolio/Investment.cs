namespace InvestmentPortfolio
{
    public class Investment
    {
        public int ID { get; set; }
        public string Name { get; set; } = String.Empty;
        public string? Ticker { get; set; }
        public string Type { get; set; } = String.Empty;
        public DateTime Date_Bought { get; set; } = new DateTime();
        public DateTime? Date_Sold { get; set; } = null;
        public string Status { get; set; } = String.Empty;
        public double Cost { get; set; }
        public double? Revenue { get; set; } = null;
        public double? Dividends { get; set; } = 0;
        public double? Net_Profit_Percentage { get; set; }
        public double? Net_Profit { get; set; }
    }
}
