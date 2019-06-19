using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace cmc2.Models
{
    public class AdminViewModel
    {
    }

    public class RoleViewModel
    {
        public string Id { get; set; }
        [Required(AllowEmptyStrings = false)]
        [Display(Name = "RoleName")]
        public string Name { get; set; }
    }

    public class EditUserViewModel
    {
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Email")]
        [EmailAddress]
        public string Email { get; set; }
        public int GroupId { get; set; }
        public bool Status { get; set; }
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Display(Name = "Code")]
        public string Code { get; set; }
        [Display(Name = "Volunteer Hours")]
        public decimal VolunteerHours { get; set; }
        public DateTime GroupUpdatedDateTime { get; set; }
        [Display(Name = "Home Phone")]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid Phone number")]
        public string HomePhone { get; set; }
        [Display(Name = "Cell Phone")]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid Phone number")]
        public string CellPhone { get; set; }
        [Display(Name = "Emergency Phone")]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid Phone number")]
        public string EmergencyPhone { get; set; }

        [Display(Name = "Address First")]
        public string AddressFirst { get; set; }
        [Display(Name = "Address Second")]
        public string AddressSecond { get; set; }
        public string City { get; set; }
        [Display(Name = "State")]
        public string State { get; set; }
        [RegularExpression(@"^\d{5}(-\d{4})?$", ErrorMessage = "Invalid Zip")]
        public string Zip { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime CertificationDate { get; set; }


        public bool sendEmail { get; set; }
        public IEnumerable<SelectListItem> GroupList { get; set; }
        public IEnumerable<SelectListItem> RolesList { get; set; }
        public IEnumerable<SelectListItem> StatesList { get; set; }
    }
}