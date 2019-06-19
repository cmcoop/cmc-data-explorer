using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using System.Runtime.Serialization;

namespace cmc2.Models
{
    public class Group
    {        
        public int Id { get; set; }
        [Required]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Code { get; set; }
        public string Name { get; set; }
        public string BenthicMethod { get; set; }
        public string ContactName { get; set; }
        public string ContactEmail { get; set; }
        public string ContactCellPhone { get; set; }
        public string ContactOfficePhone { get; set; }        
        public string ParametersSampled { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }         
        public byte[] Logo { get; set; }
        public string AddressFirst { get; set; }
        public string AddressSecond { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public bool Status { get; set; }
        public bool cmcQapp { get; set; }
        public bool coordinatorCanPublish { get; set; }
        public virtual ICollection<ParameterGroup> ParameterGroups { get; set; }
        public virtual ICollection<StationGroup> StationGroups { get; set; }
        public string CmcMember { get; set; }
        public string CmcMember2 { get; set; }
        public string CmcMember3 { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime ModifiedDate { get; set; }
        [ForeignKey("CmcMember")]

        
        //Navigation property
        public virtual ApplicationUser CmcMemberUser { get; set; }

        [ForeignKey("CmcMember2")]
        //Navigation property
        public virtual ApplicationUser CmcMemberUser2 { get; set; }

        [ForeignKey("CmcMember3")]
        //Navigation property
        public virtual ApplicationUser CmcMemberUser3 { get; set; }

        [ForeignKey("CreatedBy")]
        //Navigation property
        public virtual ApplicationUser CreatedByUser { get; set; }

        [ForeignKey("ModifiedBy")]
        //Navigation property
        public virtual ApplicationUser ModifiedByUser { get; set; }
    } 

   
}