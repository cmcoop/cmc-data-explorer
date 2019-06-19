using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class BenthicEvent
    {
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "DateTime2")]
        public DateTime DateTime { get; set; }
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }        
        
        // Foreign Key
        public int StationId { get; set; }        
        //Navigation property
        public Station Station { get; set; }

        //Foreign Key
        public int GroupId { get; set; }
        //Navigation property
        public Group Group { get; set; }
        
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

        public virtual ICollection<BenthicMonitorLog> BenthicMonitorLogs { get; set; }

        public virtual ICollection<BenthicEventCondition> BenthicEventConditions { get; set; }
    }
}