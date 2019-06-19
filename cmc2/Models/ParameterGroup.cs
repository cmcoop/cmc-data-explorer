using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace cmc2.Models
{
    public class ParameterGroup
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }       
        [Index("IX_GroupParameter", 1, IsUnique = true)]
        public int GroupId { get; set; }
        [Index("IX_GroupParameter", 2, IsUnique = true)]
        public int ParameterId { get; set; }
        //[Index("IX_GroupParameter", 3, IsUnique = true)]
        public Nullable<int> LabId { get; set; }
        public decimal? DetectionLimit { get; set; }

        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }
        [ForeignKey("ParameterId")]
        public virtual Parameter Parameter { get; set; }
        [ForeignKey("LabId")]
        public virtual Lab Lab { get; set; }

    }
}