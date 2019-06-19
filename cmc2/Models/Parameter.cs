using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class Parameter
    {
        
        public int Id { get; set; }
        [Required]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Code { get; set; }
        public string Name { get; set; }
        public string Units { get; set; }
        public int? Method { get; set; }
        public string Tier { get; set; }
        public string Matrix { get; set; }
        public bool? Tidal { get; set; }
        public bool? NonTidal { get; set; }
        public string AnalyticalMethod { get; set; }
        public string ApprovedProcedure { get; set; }
        public string Equipment { get; set; }
        public string Precision { get; set; }
        public string Accuracy { get; set; }
        public string Range { get; set; }
        public string QcCriteria { get; set; }
        public string InspectionFreq { get; set; }
        public string InspectionType { get; set; }
        public string CalibrationFrequency { get; set; }
        public string StandardOrCalInstrumentUsed { get; set; }
        public string TierIIAdditionalReqs { get; set; }
        public string HoldingTime { get; set; }
        public string SamplePreservation { get; set; }
        public bool requiresSampleDepth { get; set; }
        public bool requiresDuplicate { get; set; }
        public bool isCalibrationParameter { get; set; }
        public bool Status { get; set; }
        public string Description { get; set; }
        public decimal? NonfatalUpperRange { get; set; }
        public decimal? NonfatalLowerRange { get; set; }
        public virtual ICollection<ParameterGroup> ParameterGroups { get; set; }

        [InverseProperty("WqParameter")]
        public ICollection<RelatedParameter> WqRelatedParameters { get; set; }
        [InverseProperty("CalibrationParameter")]
        public ICollection<RelatedParameter> CalibrationRelatedParameters { get; set; }

    }
}