using cmc2.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using cmc2.Helpers;

namespace cmc2.Controllers
{
    [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
    public class GroupsAdminController : Controller
    {
        
        // GET: /Users/
        public ActionResult Index()
        {
            if (!Request.Path.EndsWith("/"))
            {
                return RedirectPermanent(Request.Url.ToString() + "/");
            }


            return View();
        }

       
        
    }
}
