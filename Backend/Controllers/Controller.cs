using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class Controller : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello World");
        }
        [HttpPost]
        public IActionResult Post(string book)
        {
            return Ok(book);
        }
        [HttpPut]
        public IActionResult Put(Book book)
        {
            return Ok(string);
        }
        [HttpDelete]
        public IActionResult Delete(string book)
        {
            return Ok(book);
        }
    }
}
