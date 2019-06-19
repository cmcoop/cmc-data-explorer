using cmc2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web.Script.Serialization;
using System.Web.Http;

namespace cmc2.Helpers
{
    public class adminLogic
    {
        public static List<string> rolesAdminCanManage = new List<string>
            { "Admin", "Officer", "Member", "Coordinator", "Monitor" };
        public static List<string> rolesOfficerCanManage = new List<string>
            { "Member", "Coordinator", "Monitor","Officer" };
        public static List<string> rolesMemberCanManage = new List<string>
            { "Coordinator", "Monitor","Member" };
        public static List<string> rolesCoordinatorCanManage = new List<string>
            { "Monitor" };


       


        
    }


}