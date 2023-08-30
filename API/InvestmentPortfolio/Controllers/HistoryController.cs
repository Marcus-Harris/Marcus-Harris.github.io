using InvestmentPortfolio.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvestmentPortfolio.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class HistoryController : ControllerBase
  {
    private readonly DataContext _context;
    public HistoryController(DataContext context)
    {
      this._context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<History>>> GetHistory()
    {
      return Ok(await _context.History.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<History>> GetSingleHistory(int id)
    {
      var DBhistory = await _context.History.FindAsync(id);

      if (DBhistory == null)
        return BadRequest("This Change Does Not Exist!");

      return Ok(await _context.History.FindAsync(id));
    }

    [HttpPost]
    public async Task<ActionResult<List<History>>> CreateHistory(History history)
    {
      {
        _context.History.Add(history);
        await _context.SaveChangesAsync();

        return Ok(await _context.History.ToListAsync());
      }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<List<History>>> DeleteHistory(int id)
    {
      var DBhistory = await _context.History.FindAsync(id);

      if (DBhistory == null)
        return BadRequest("This Change Does Not Exist!");

      _context.History.Remove(DBhistory);
      await _context.SaveChangesAsync();

      return Ok(await _context.History.ToListAsync());
    }
  }
}