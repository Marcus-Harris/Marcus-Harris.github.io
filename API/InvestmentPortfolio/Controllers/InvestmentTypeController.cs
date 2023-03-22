using InvestmentPortfolio.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestmentPortfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestmentTypeController : ControllerBase
    {
        private readonly DataContext _context;
        public InvestmentTypeController(DataContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<InvestmentType>>> GetInvestmentTypes()
        {
            return Ok(await _context.InvestmentTypes.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InvestmentType>> GetInvestment(int id)
        {
            var DBtype = await _context.InvestmentTypes.FindAsync(id);

            if (DBtype == null)
                return BadRequest("Investment Type Does Not Exist!");

            return Ok(await _context.InvestmentTypes.FindAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<List<InvestmentType>>> CreateInvestmentTypes(InvestmentType investmentType)
        {
            {
                _context.InvestmentTypes.Add(investmentType);
                await _context.SaveChangesAsync();

                return Ok(await _context.InvestmentTypes.ToListAsync());
            }
        }

        [HttpPut]
        public async Task<ActionResult<List<InvestmentType>>> UpdateInvestmentTypes(InvestmentType investmentType)
        {
            var DBtype = await _context.InvestmentTypes.FindAsync(investmentType.ID);

            if(DBtype == null)
                return BadRequest("Investment Type Does Not Exist!");

            DBtype.Type = investmentType.Type;
            await _context.SaveChangesAsync();

            return Ok(await _context.InvestmentTypes.ToListAsync());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<InvestmentType>>> DeleteInvestmentTypes(int id)
        {
            var DBtype = await _context.InvestmentTypes.FindAsync(id);

            if (DBtype == null)
                return BadRequest("Investment Type Does Not Exist!");

            _context.InvestmentTypes.Remove(DBtype);
            await _context.SaveChangesAsync();

            return Ok(await _context.InvestmentTypes.ToListAsync());
        }
    }
}
