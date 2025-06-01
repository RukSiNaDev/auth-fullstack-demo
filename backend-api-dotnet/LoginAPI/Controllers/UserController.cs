using System.Security.Cryptography;
using System.Text;
using LoginAPI.Model;
using LoginAPI.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LoginAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("allowCors")]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly TokenService _tokenService;

        public UserController(UserDbContext userDbContext, TokenService tokenService)
        {
            _context = userDbContext;
            _tokenService = tokenService;
        }

        [HttpPost("createNewUser")]
        public IActionResult CreateUser(User obj) 
        {
            var userExitWithEmail = _context.Users.SingleOrDefault(m => m.email == obj.email);
            if (userExitWithEmail == null)
            {
            
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(obj.password);
                  
                obj.password = hashedPassword;
                _context.Users.Add(obj);
                _context.SaveChanges();

                return Created("User Regidtered Succes", obj);
            }
            else
            {
                return StatusCode(500, "Email Already Exist");
            }
           
        }

        [HttpPost("resetPassword")]
        public IActionResult ResetPassword(ResetPasswordDto model)
        {
            var user = _context.Users.SingleOrDefault(u => u.email == model.email);
            if (user == null)
            {
                return NotFound("User with this email does not exist.");
            }

            // Hash new password
            user.password = BCrypt.Net.BCrypt.HashPassword(model.newPassword);
            _context.SaveChanges();

            return StatusCode(200, new { message = "Password has been reset successfully." });
        }

        [HttpPost("login")]
        public IActionResult Login(UserLogin obj)
        {
            var user = _context.Users.SingleOrDefault(m=>m.email == obj.email);
            if (user == null)
            {
                return StatusCode(401, "Wrong Credentials");
            }
            else
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(obj.password, user.password);

                if (!isPasswordValid)
                {
                    return StatusCode(401, "Wrong Credentials (Invalid password)");
                }
                var userObj = new UserDto
                {
                    email = user.email,
                    mobileNo = user.mobileNo,
                    createDate = user.createDate,
                    fullName = user.fullName,
                    role = user.role
                };

                var token = _tokenService.CreateToken(user);

                return StatusCode(200, new { token });
            }
           
        }

        [HttpGet("getUser")]
        public IActionResult GetUser()
        { 
            var list = _context.Users.ToList();
            return Ok(list);
        }
    }
}
