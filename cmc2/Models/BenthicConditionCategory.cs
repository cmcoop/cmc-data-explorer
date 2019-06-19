using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace cmc2.Models
{
    public class BenthicConditionCategory
    {
        
        public int Id { get; set; }
        [Required]
        public int ConditionId { get; set; }
        public string Category { get; set; }       
        public string CategoryText { get; set; } 
        public int Order { get; set; }
        public string Comments { get; set; }
    }
}