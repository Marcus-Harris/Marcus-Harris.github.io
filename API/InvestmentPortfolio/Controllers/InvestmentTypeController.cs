using InvestmentPortfolio.Data;
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
        History history = new History();
        history.Entry = investmentType.Type + " has been added as a type.";
        history.Type = "Investment Type";

        _context.InvestmentTypes.Add(investmentType);
        _context.History.Add(history);

        await _context.SaveChangesAsync();

        return Ok(await _context.InvestmentTypes.ToListAsync());
      }
    }

    [HttpPut]
    public async Task<ActionResult<List<InvestmentType>>> UpdateInvestmentTypes(InvestmentType investmentType)
    {
      var DBtype = await _context.InvestmentTypes.FindAsync(investmentType.ID);

      if (DBtype == null)
        return BadRequest("Investment Type Does Not Exist!");

      History history = new History();
      history.Entry = DBtype.Type + " has been renamed as " + investmentType.Type + ".";
      history.Type = "Investment Type";

      DBtype.Type = investmentType.Type;
      _context.History.Add(history);
      await _context.SaveChangesAsync();

      return Ok(await _context.InvestmentTypes.ToListAsync());
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<List<InvestmentType>>> DeleteInvestmentTypes(int id)
    {
      var DBtype = await _context.InvestmentTypes.FindAsync(id);

      if (DBtype == null)
        return BadRequest("Investment Type Does Not Exist!");

      History history = new History();
      history.Entry = DBtype.Type + " has been deleted as a type.";
      history.Type = "Investment Type";

      _context.InvestmentTypes.Remove(DBtype);
      _context.History.Add(history);
      await _context.SaveChangesAsync();

      return Ok(await _context.InvestmentTypes.ToListAsync());
    }
  }
}
