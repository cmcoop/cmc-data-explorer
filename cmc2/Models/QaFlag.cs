using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace cmc2.Models
{
    public class QaFlag
    {
        
        public int Id { get; set; }
        [Required]
        public string Description { get; set; }        

    }
}