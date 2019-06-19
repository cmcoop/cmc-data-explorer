using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class Sample
    {
        [Key]
        public int Id { get; set; }
        
        public decimal? Value { get; set; }
        public decimal? Depth { get; set; }
        public int SampleId { get; set; }
        public string Comments { get; set; }

        // Foreign Key
        public int EventId { get; set; }
        // Foreign Key
        public int ParameterId { get; set; }
        // Foreign Key
        [ForeignKey("Problem")]
        public int? ProblemId { get; set; }
        // Foreign Key
        [ForeignKey("Qualifier")]
        public int? QualifierId { get; set; }
        // Foreign Key
        [ForeignKey("QaFlag")]
        public int QaFlagId { get; set; }

        //Navigation
        public Event Event { get; set; }
        public Parameter Parameter { get; set; }
        public Problem Problem { get; set; }
        public Qualifier Qualifier { get; set; }
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