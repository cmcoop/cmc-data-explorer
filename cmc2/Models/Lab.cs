using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class Lab
    {        
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [StringLength(10)]
        [Index(IsUnique = true)]
        public string Code { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime ModifiedDate { get; set; }
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }
        [ForeignKey("CreatedBy")]
        //Navigation property
        public virtual ApplicationUser CreatedByUser { get; set; }

        [ForeignKey("ModifiedBy")]
        //Navigation property
        public virtual ApplicationUser ModifiedByUser { get; set; }
    } 

   
}