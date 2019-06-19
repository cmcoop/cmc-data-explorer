using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class BenthicSample
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public decimal Value { get; set; }
        public string Comments { get; set; }

        // Foreign Key
        public int BenthicEventId { get; set; }
        // Foreign Key
        public int BenthicParameterId { get; set; }
        
        // Foreign Key
        [ForeignKey("QaFlag")]
        public int QaFlagId { get; set; }

        //Navigation
        public BenthicEvent BenthicEvent { get; set; }
        public BenthicParameter BenthicParameter { get; set; }
        
        public QaFlag QaFlag { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime ModifiedDate { get; set; }

        [ForeignKey("CreatedBy")]
        //Navigation property
        public virtual ApplicationUser CreatedByUser { get; set; }

        [ForeignKey("ModifiedBy")]
        //Navigation property
        public virtual ApplicationUser ModifiedByUser { get; set; }
    }
}