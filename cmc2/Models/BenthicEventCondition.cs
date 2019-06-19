using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace cmc2.Models
{
    public class BenthicEventCondition
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }       
        [Index("IX_GroupParameter", 1, IsUnique = true)]
        public int BenthicEventId { get; set; }
        [Index("IX_GroupParameter", 2, IsUnique = true)]
        public int BenthicConditionId { get; set; }
        public string Value { get; set; }
        [ForeignKey("BenthicEventId")]
        public virtual BenthicEvent BenthicEvent { get; set; }
        [ForeignKey("BenthicConditionId")]
        public virtual BenthicCondition BenthicCondition { get; set; }
        

    }
}