using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cmc2.Models
{
    public class BenthicParameter
    {
        public int Id { get; set; }
        [Required]
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Code { get; set; }
        public string Name { get; set; }
        public string Method { get; set; }
        public int allarmGroup { get; set; }
        public int iwlRockyGroup { get; set; }
        public int iwlMuddyGroup { get; set; }
        public int allarmOrder { get; set; }
        public int iwlOrder { get; set; }
        public bool tolerant { get; set; }
        public bool nonInsects { get; set; }
        public string BottomType { get; set; }
        public string Comments { get; set; }
    }
}