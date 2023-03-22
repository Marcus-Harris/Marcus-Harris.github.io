using InvestmentPortfolio.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
                if(investment.Date_Sold == null)
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
                    if(investment.Revenue <= 0)
                    {
                        return BadRequest("You Cannot Sell an Investment for $0 or less!");
                    }
                    investment.Status = "Sold";
                    investment.Revenue = Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero);
                    investment.Cost = Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero);
                    investment.Dividends = Math.Round((double)investment.Dividends!, 2, MidpointRounding.AwayFromZero);
                    investment.Net_Profit_Percentage = (((Math.Round((double) investment.Revenue!, 2, MidpointRounding.AwayFromZero) + Math.Round((double) investment.Dividends!, 2, MidpointRounding.AwayFromZero)) - Math.Round((double) investment.Cost, 2, MidpointRounding.AwayFromZero)) / Math.Round((double) investment.Cost, 2, MidpointRounding.AwayFromZero)) * 100;
                    investment.Net_Profit = (Math.Round((double)investment.Revenue!, 2, MidpointRounding.AwayFromZero) + Math.Round((double) investment.Dividends, 2, MidpointRounding.AwayFromZero)) - Math.Round((double) investment.Cost, 2, MidpointRounding.AwayFromZero);

                    investment.Net_Profit_Percentage = Math.Round((double)investment.Net_Profit_Percentage, 2, MidpointRounding.AwayFromZero);
                    investment.Net_Profit = Math.Round((double)investment.Net_Profit, 2, MidpointRounding.AwayFromZero);
                    
                    if(!investment.Ticker.IsNullOrEmpty())
                    {
                        investment.Ticker = investment.Ticker!.ToUpper();
                    }
                }

                _context.Investments.Add(investment);
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
                DBinvestment.Revenue = Math.Round((double) investment.Revenue!, 2, MidpointRounding.AwayFromZero);
                DBinvestment.Net_Profit_Percentage = (( Math.Round((double) investment.Revenue!, 2, MidpointRounding.AwayFromZero) + Math.Round((double) investment.Dividends!, 2, MidpointRounding.AwayFromZero) - Math.Round((double) investment.Cost, 2, MidpointRounding.AwayFromZero)) / Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero)) * 100;
                DBinvestment.Net_Profit = (Math.Round((double) investment.Revenue, 2, MidpointRounding.AwayFromZero) + Math.Round((double)investment.Dividends, 2, MidpointRounding.AwayFromZero)) - Math.Round((double)investment.Cost, 2, MidpointRounding.AwayFromZero);

                DBinvestment.Net_Profit_Percentage = Math.Round((double) DBinvestment.Net_Profit_Percentage, 2, MidpointRounding.AwayFromZero);
                DBinvestment.Net_Profit = Math.Round((double) DBinvestment.Net_Profit, 2, MidpointRounding.AwayFromZero);
            }
            if (!DBinvestment.Ticker.IsNullOrEmpty())
            {
                DBinvestment.Ticker = DBinvestment.Ticker!.ToUpper();
            }
            DBinvestment.Name = investment.Name;
            DBinvestment.Type = investment.Type;
            DBinvestment.Date_Bought = investment.Date_Bought;
            DBinvestment.Date_Sold = investment.Date_Sold;
            DBinvestment.Cost = Math.Round((double) investment.Cost, 2, MidpointRounding.AwayFromZero);
            DBinvestment.Dividends = Math.Round((double) investment.Dividends!, 2, MidpointRounding.AwayFromZero);
            await _context.SaveChangesAsync();

            return Ok(await _context.Investments.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<Investment>>> DeleteInvestment(int id)
        {
            var DBinvestment = await _context.Investments.FindAsync(id);

            if (DBinvestment == null)
                return BadRequest("Investment Type Does Not Exist!");

            _context.Investments.Remove(DBinvestment);
            await _context.SaveChangesAsync();

            return Ok(await _context.Investments.ToListAsync());
        }
    }
}
