using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class Condition
    {
        
        public int Id { get; set; }
        [Required]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool isCategorical { get; set; }
        public bool Status { get; set; }
        public int Order { get; set; }

    }
}