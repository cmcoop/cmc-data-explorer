using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web.Script.Serialization;
using System.Web.Http.Controllers;
using System.Net;
using cmc2.Models;
using cmc2.Helpers;

namespace cmc2.Helpers
{
    class AuthorizeLogic
    {
        
       
        public static bool VerifyBenthicEventEditPermission(BenthicEvent benthicEvent)
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var id = HttpContext.Current.User.Identity.GetUserId();
            var context = new ApplicationDbContext();
            //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();
            var applicationUserManager = new ApplicationUserManger().UserManager;
            var user = applicationUserManager.FindById(id);
            var role = applicationUserManager.GetRoles(user.Id).FirstOrDefault();

            if (role == "Coordinator" | role == "Monitor")
            {

                if (benthicEvent.GroupId == user.GroupId)
                {
                    if (role == "Monitor")
                    {
                        if (benthicEvent.CreatedBy == id)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }

        public static bool VerifyEventEditPermission(Event Event)
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var id = HttpContext.Current.User.Identity.GetUserId();
            var context = new ApplicationDbContext();
            //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();
            var applicationUserManager = new ApplicationUserManger().UserManager;
            var user = applicationUserManager.FindById(id);
            var role = applicationUserManager.GetRoles(user.Id).FirstOrDefault();

            if (role == "Coordinator" | role == "Monitor")
            {               

                if (Event.GroupId == user.GroupId)
                {
                    if (role == "Monitor")
                    {
                        if (Event.CreatedBy == id)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }

        public static bool VerifyGroupEditPermission(Group Group)
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var id = HttpContext.Current.User.Identity.GetUserId();
            var context = new ApplicationDbContext();
            //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();
            var applicationUserManager = new ApplicationUserManger().UserManager;
            var user = applicationUserManager.FindById(id);
            var role = applicationUserManager.GetRoles(user.Id).FirstOrDefault();

            if (role == "Coordinator")
            {

                if (Group.Id == user.GroupId)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }


        public static bool VerifyStationGroupEditPermission(StationGroup StationGroup)
        {
            ApplicationDbContext db = new ApplicationDbContext();
            var id = HttpContext.Current.User.Identity.GetUserId();
            var context = new ApplicationDbContext();
            //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();
            var applicationUserManager = new ApplicationUserManger().UserManager;
            var user = applicationUserManager.FindById(id);
            var role = applicationUserManager.GetRoles(user.Id).FirstOrDefault();

            if (role == "Coordinator" | role == "Monitor")
            {

                if (StationGroup.GroupId == user.GroupId)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }
    }
}