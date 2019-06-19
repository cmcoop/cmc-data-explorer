using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace cmc2.Models
{
    public class Problem
    {
        
        public int Id { get; set; }
        [Required]
        public string Code { get; set; }
        public string Description { get; set; }        
        public int Order { get; set; }
        public string ApplicationText { get; set; }

    }
}