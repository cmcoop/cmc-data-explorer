using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace cmc2.Models
{
    public class UserViewModel
    {
        public string Code { get; set; }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string State { get; set; }
        public int GroupId { get; set; }
        public bool Status { get; set; }
        public bool HasBeenActivated { get; set; }
        public string Email { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public Group Group { get; set; }
        
    }
}