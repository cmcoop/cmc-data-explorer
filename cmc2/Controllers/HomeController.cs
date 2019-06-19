using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.EntityFramework;
using cmc2.Models;
using Newtonsoft.Json;
using System.Web.Http;

namespace cmc2.Controllers
{
    
    public class HomeController : Controller
    {

        private ApplicationDbContext db = new ApplicationDbContext();
        public ActionResult Index()
        {
           
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Here is a description of the CMC application.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Contact the Chesapeake Monitoring Cooperative";

            return View();
        }

        
    }
}