using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace cmc2.Helpers
{
    public  class ApplicationUserManger
    {
        public ApplicationUserManager UserManager
        {
            get
            {
                if (_userManager == null) { _userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
                return _userManager;
            }
        }

        private ApplicationUserManager _userManager;
    }
}