using InvestmentPortfolio.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;
using System.Diagnostics;

namespace InvestmentPortfolio.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class InvestmentController : ControllerBase
  {
    private readonly DataContext _context;
    public InvestmentController(DataContext context)
    {
      this._context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Investment>>> GetAllInvestments()
    {
      return Ok(await _context.Investments.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Investment>> GetInvestment(int id)
    {
      var DBinvestment = await _context.Investments.FindAsync(id);

      if (DBinvestment == null)
        return BadRequest("Investment Does Not Exist!");

      return Ok(await _context.Investments.FindAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<List<Investment>>> CreateInvestment(Investment investment)
    {
      {
        if (investment.Date_Sold == null)
        {
          if ((investment.Date_Sold is null) && !(investment.Revenue is null))
          {
            return BadRequest("Investment Cannot Have a Sell Value Without a Sell Date!");
          }
          else
          {
            investment.Status = "Unsold";
            investment.Revenue = null;
            investment.Net_Profit_Percentage = null;
            investment.Net_Profit = null;
          }
        }
        else if (investment.Date_Bought > investment.Date_Sold)
        {
          return BadRequest("The Sell Date Cannot Take Place before the Buy Date!");
        }
        else
        {
          if (investment.Revenue <= 0)
          {
            return BadRequest("You Cannot Sell an Investment for $0 or less!");
          }
          investment.Status = "Sold";
          investment.Revenue = Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero);
          investment.Cost = Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero);
          investment.Dividends = Math.Round((double)investment.Dividends!, 2, MidpointRounding.AwayFromZero);
          investment.Net_Profit_Percentage = (((Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero) + Math.Round((double)investment.Dividends!, 2, MidpointRounding.AwayFromZero)) - Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero)) / Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero)) * 100;
          investment.Net_Profit = (Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero) + Math.Round((double)investment.Dividends, 2, MidpointRounding.AwayFromZero)) - Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero);

          investment.Net_Profit_Percentage = Math.Round((double)investment.Net_Profit_Percentage, 2, MidpointRounding.AwayFromZero);
          investment.Net_Profit = Math.Round((double)investment.Net_Profit, 2, MidpointRounding.AwayFromZero);

          if (!investment.Ticker.IsNullOrEmpty())
          {
            investment.Ticker = investment.Ticker!.ToUpper();
          }
        }

        History history = new History();
        history.Entry = investment.Name + " has been added to your investments.";
        history.Type = "Investment";

        _context.Investments.Add(investment);
        _context.History.Add(history);
        await _context.SaveChangesAsync();

        return Ok(await _context.Investments.ToListAsync());
      }
    }

    [HttpPut]
    public async Task<ActionResult<List<Investment>>> UpdateInvestment(Investment investment)
    {
      var DBinvestment = await _context.Investments.FindAsync(investment.ID);

      if (DBinvestment == null)
        return BadRequest("Investment Type Does Not Exist!");
      
      if
      (
        DBinvestment.Name == investment.Name &&
        DBinvestment.Ticker == investment.Ticker &&
        DBinvestment.Type == investment.Type &&
        DBinvestment.Date_Bought == investment.Date_Bought &&
        DBinvestment.Date_Sold == investment.Date_Sold &&
        DBinvestment.Cost == investment.Cost &&
        DBinvestment.Revenue == investment.Revenue &&
        DBinvestment.Dividends == investment.Dividends
      )
        return BadRequest("No changes have been made!");
      
      string entry = "";
      string investmentProperties = "";
      int investmentChangeCounter = 0;

      if (DBinvestment != null)
      {
        if (DBinvestment.Name != investment.Name)
        {
          investmentProperties = investmentProperties + "name, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Ticker != investment.Ticker)
        {
          investmentProperties = investmentProperties + "ticker, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Type != investment.Type)
        {
          investmentProperties = investmentProperties + "type, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Date_Bought != investment.Date_Bought)
        {
          investmentProperties = investmentProperties + "purchase date, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Date_Sold != investment.Date_Sold)
        {
          investmentProperties = investmentProperties + "sell date, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Cost != investment.Cost)
        {
          investmentProperties = investmentProperties + "cost, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Revenue != investment.Revenue)
        {
          investmentProperties = investmentProperties + "revenue, ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if (DBinvestment.Dividends != investment.Dividends)
        {
          investmentProperties = investmentProperties + "dividends ";
          investmentChangeCounter = investmentChangeCounter + 1;
        }

        if(investmentProperties != "") 
        {
          if (investmentProperties.Contains("name"))
          {
            entry = investment.Name + " (formerly called " + DBinvestment.Name + ") had its " + investmentProperties + "changed.";
          }
          else
          {
            entry = investment.Name + " had its " + investmentProperties + "changed.";
          }
        }

        entry = entry.Replace(", changed", " changed");

        if(investmentChangeCounter > 1)
        {
          MatchCollection coll = Regex.Matches(entry, @"(,[\s][\w]{4,8}[\s][\w]{4}[\s]changed.)|(,[\s][\w]{1,10}[\s]changed.)");
          string lastProperty = coll[0].ToString();
          lastProperty = Regex.Replace(lastProperty, ",", " and");
          entry = Regex.Replace(entry, @"(,[\s][\w]{4,8}[\s][\w]{4}[\s]changed.)|(,[\s][\w]{1,10}[\s]changed.)", lastProperty);
        }
      }

      if (DBinvestment == null)
        return BadRequest("Investment Type Does Not Exist!");
      
      if (investment.Date_Sold == null)
      {
        if ((investment.Date_Sold is null) && !(investment.Revenue is null))
        {
          return BadRequest("Investment Cannot Have a Sell Value Without a Sell Date!");
        }
        else
        {
          DBinvestment.Status = "Unsold";
          DBinvestment.Revenue = null;
          DBinvestment.Net_Profit_Percentage = null;
          DBinvestment.Net_Profit = null;
        }
      }
      else if (investment.Date_Bought > investment.Date_Sold)
      {
        return BadRequest("The Sell Date Cannot Take Place before the Buy Date!");
      }
      else
      {
        if (investment.Revenue <= 0)
        {
          return BadRequest("You Cannot Sell an Investment for $0 or less!");
        }
        DBinvestment.Status = "Sold";
        DBinvestment.Revenue = Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero);
        DBinvestment.Net_Profit_Percentage = ((Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero) + Math.Round((double)investment.Dividends!, 2, MidpointRounding.AwayFromZero) - Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero)) / Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero)) * 100;
        DBinvestment.Net_Profit = (Math.Round((double)investment.Revenue, 2, MidpointRounding.AwayFromZero) + Math.Round((double)investment.Dividends, 2, MidpointRounding.AwayFromZero)) - Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero);

        DBinvestment.Net_Profit_Percentage = Math.Round((double)DBinvestment.Net_Profit_Percentage, 2, MidpointRounding.AwayFromZero);
        DBinvestment.Net_Profit = Math.Round((double)DBinvestment.Net_Profit, 2, MidpointRounding.AwayFromZero);
      }
      if (!DBinvestment.Ticker.IsNullOrEmpty())
      {
        DBinvestment.Ticker = DBinvestment.Ticker!.ToUpper();
      }
      DBinvestment.Name = investment.Name;
      DBinvestment.Type = investment.Type;
      DBinvestment.Date_Bought = investment.Date_Bought;
      DBinvestment.Date_Sold = investment.Date_Sold;
      DBinvestment.Cost = Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero);
      DBinvestment.Dividends = Math.Round((double)investment.Dividends!, 2, MidpointRounding.AwayFromZero);

      History history = new History();
      history.Entry = entry;
      history.Type = "Investment";
      _context.History.Add(history);
      
      await _context.SaveChangesAsync();

      return Ok(await _context.Investments.ToListAsync());
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<List<Investment>>> DeleteInvestment(int id)
    {
      var DBinvestment = await _context.Investments.FindAsync(id);

      if (DBinvestment == null)
        return BadRequest("Investment Type Does Not Exist!");


      History history = new History();
      history.Entry = DBinvestment.Name + " has been deleted from your investments.";
      history.Type = "Investment";
      _context.Investments.Remove(DBinvestment);
      _context.History.Add(history);
      await _context.SaveChangesAsync();

      return Ok(await _context.Investments.ToListAsync());
    }
  }
}
