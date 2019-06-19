using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace cmc2.Models
{
    public class StationGroup
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
       
        [Index("IX_GroupParameter", 1, IsUnique = true)]
        public int GroupId { get; set; }
        [Index("IX_GroupParameter", 2, IsUnique = true)]
        public int StationId { get; set; }
        public virtual Group Group { get; set; }
        public virtual Station Station { get; set; }

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