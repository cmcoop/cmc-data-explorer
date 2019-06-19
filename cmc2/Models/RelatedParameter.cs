using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace cmc2.Models
{
    public class RelatedParameter
    {
        [Key]
        public int Id { get; set; }

        public int? WqParameterId { get; set; }
        public int? CalibrationParameterId { get; set; }

        [ForeignKey("WqParameterId")]
        public virtual Parameter WqParameter { get; set; }
        [ForeignKey("CalibrationParameterId")]
        public virtual Parameter CalibrationParameter { get; set; }        

    }
}