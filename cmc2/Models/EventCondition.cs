using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace cmc2.Models
{
    public class EventCondition
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }       
        [Index("IX_GroupParameter", 1, IsUnique = true)]
        public int EventId { get; set; }
        [Index("IX_GroupParameter", 2, IsUnique = true)]
        public int ConditionId { get; set; }
        public string Value { get; set; }
        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }
        [ForeignKey("ConditionId")]
        public virtual Condition Condition { get; set; }
        

    }
}