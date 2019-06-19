using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class Station
    {
        public int Id { get; set; }
        [Required]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Code { get; set; }
        public string Name { get; set; }
        public string NameLong { get; set; }
        public string Description { get; set; }
        public decimal Lat { get; set; }
        public decimal Long { get; set; }
        public string Cbseg { get; set; }
        public string Datum { get; set; }
        public string CityCounty { get; set; }

        public string Fips { get; set; }
        public string Huc12 { get; set; }
        public string Huc6Name { get; set; }
        public string State { get; set; }
        public bool Tidal { get; set; }
        public string WaterBody { get; set; }
        public string Comments { get; set; }
        public bool Status { get; set; }
        
        public virtual ICollection<StationGroup> StationGroups { get; set; }
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime ModifiedDate { get; set; }

        [ForeignKey("StationSamplingMethod")]
        public int? StationSamplingMethodId { get; set; }

        //Navigation property
        public StationSamplingMethod StationSamplingMethod { get; set; }

        [ForeignKey("CreatedBy")]
        //Navigation property
        public virtual ApplicationUser CreatedByUser { get; set; }

        [ForeignKey("ModifiedBy")]
        //Navigation property
        public virtual ApplicationUser ModifiedByUser { get; set; }
    }
}