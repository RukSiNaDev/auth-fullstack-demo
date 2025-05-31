using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace LoginAPI.Model
{
    public class UserDbContext:DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }  
    }

    [Table("users")]
    public class User
    {
        [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int userId { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public DateTime createDate { get; set; }
        public string fullName { get; set; }
        public string mobileNo { get; set; }
        public string role { get; set; }

    }

    public class UserLogin 
    {
        public string email { get; set; }
        public string password { get; set; }
    }

    public class ResetPasswordDto
    {
        public string email { get; set; }
        public string newPassword { get; set; }
    }

    public class UserDto
    {
        public string email { get; set; }
        public string mobileNo { get; set; }
        public DateTime createDate { get; set; }
        public string fullName { get; set; }
        public string role { get; set; }
    }
}
