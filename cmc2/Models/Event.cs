using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class Event
    {
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "DateTime2")]
       // [Index("IX_StationandDateTime",2,IsUnique = true)]
        public DateTime DateTime { get; set; }
        public string Project { get; set; }
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }


        // Foreign Key
        public int StationId { get; set; }
        //[Index("IX_StationandDateTime", 1, IsUnique = true)]
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

        public virtual ICollection<MonitorLog> MonitorLogs { get; set; }

        public virtual ICollection<EventCondition> EventConditions { get; set; }
    }
}