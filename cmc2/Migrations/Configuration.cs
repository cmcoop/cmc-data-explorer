namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using cmc2.Models;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity;
    using System.Web.Configuration;
    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            //createRolesandUsers();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        protected override void Seed(ApplicationDbContext context)
        {
            //if (!context.Groups.Any(g => g.Code.Equals("VIMS")))
            //{
            //    context.Groups.AddOrUpdate(
            //    x => x.Id,
            //    new Models.Group
            //    {
            //        ContactEmail = "parrishd@vims.edu",
            //        ContactName = "Dave Parrish",
            //        Description = "Virginia Institute of Marine Science is located in Gloucester Point, Va.",
            //        Name = "Virginia Institute of Marine Science",
            //        Code = "VIMS"
            //    }
            //);
            //}

            //if (!context.Groups.Any(g => g.Name.Equals("Chesapeake Environmental Communications")))
            //{
            //    context.Groups.AddOrUpdate(
            //        x => x.Id,
            //        new Models.Group
            //        {
            //            ContactEmail = "parrishd@vims.edu",
            //            ContactName = "Dave Parrish",
            //            Description = "Chesapeake Environmental Communications is located in Gloucester, Va.",
            //            Name = "Chesapeake Environmental Communications",
            //            Code = "AFCB"
            //        }
            //    );
            //}
            //if (!context.Problems.Any(g => g.Code.Equals("A")))
            //{
            //    context.Problems.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Problem
            //        {
            //            Code = "A",
            //            Description = "Laboratory Accident"
            //        }
            //    );
            //}
            //if (!context.Problems.Any(g => g.Code.Equals("V")))
            //{
            //    context.Problems.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Problem
            //        {
            //            Code = "V",
            //            Description = "Sample results rejected due to QC criteria"
            //        }
            //    );
            //}
            //if (!context.Problems.Any(g => g.Code.Equals("RR")))
            //{
            //    context.Problems.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Problem
            //        {
            //            Code = "RR",
            //            Description = "No Sample Received"
            //        }
            //    );
            //}
            //if (!context.Qualifiers.Any(g => g.Code.Equals("<")))
            //{
            //    context.Qualifiers.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Qualifier
            //        {
            //            Code = "<",
            //            Description = "Less than the lower method detection limit (MDL)"
            //        }
            //    );
            //}
            //if (!context.Qualifiers.Any(g => g.Code.Equals(">")))
            //{
            //    context.Qualifiers.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Qualifier
            //        {
            //            Code = ">",
            //            Description = "Greater than the upper method detection limit (MDL)"
            //        }
            //    );
            //}
            //if (!context.Qualifiers.Any(g => g.Code.Equals("E")))
            //{
            //    context.Qualifiers.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Qualifier
            //        {
            //            Code = "E",
            //            Description = "Estimated Value"
            //        }
            //    );
            //}

            //if (!context.Labs.Any(g => g.Code.Equals("GPL")))
            //{
            //    context.Labs.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Lab
            //        {
            //            Name = "Gloucester Point Lab",
            //            Code = "GPL"
            //        }
            //    );
            //}
            

            //if (!context.Stations.Any(g => g.Code.Equals("VIMS.GI")))
            //{
            //    context.Stations.AddOrUpdate(
            //        e => e.Id,
            //        new Models.Station
            //        {
            //            Code = "VIMS.GI",
            //            Name = "GI",
            //            WaterBody = "Mobjack Bay",
            //            Description = "Goodwin Island (NERRS)",
            //            Datum = "NAD83",
            //            Lat = 37.21722m,
            //            Long = -76.392222m

            //        }
            //    );
            //}

            //context.SaveChanges();
            //var group = context.Groups.First(g => g.Code.Equals("VIMS"));
            //var stationGi = context.Stations.First(g => g.Code.Equals("VIMS.GI"));
            //var paramTu = context.Parameters.First(g => g.Code.Equals("TU.1"));
            //var paramWt = context.Parameters.First(g => g.Code.Equals("WT.1"));
            //var paramP = context.Parameters.First(g => g.Code.Equals("TP.1"));
            //var labGp = context.Labs.First(g => g.Code.Equals("GPL"));
            

            //if (!context.StationGroups.Any(g => g.GroupId.Equals(group.Id) &
            //                               g.StationId.Equals(stationGi.Id)))
            //{
            //    context.StationGroups.AddOrUpdate(
            //        e => e.Id,
            //        new Models.StationGroup
            //        {
            //            StationId = stationGi.Id,
            //            GroupId = group.Id
            //        }
            //    );
            //}

            //if (!context.ParameterGroups.Any(g => g.GroupId == group.Id &&
            //                               g.ParameterId == paramTu.Id &&                                          
            //                               g.LabId == labGp.Id))
            //{
            //    context.ParameterGroups.AddOrUpdate(
            //        e => e.Id,
            //       new Models.ParameterGroup
            //       {
            //           GroupId = group.Id,
            //           ParameterId = paramTu.Id,
            //           LabId = labGp.Id
            //       }
            //    );
            //}
            //if (!context.ParameterGroups.Any(g => g.GroupId == group.Id &&
            //                               g.ParameterId == paramWt.Id &&
            //                               g.LabId == labGp.Id))
            //{
            //    context.ParameterGroups.AddOrUpdate(
            //        e => e.Id,
            //       new Models.ParameterGroup
            //       {
            //           GroupId = group.Id,
            //           ParameterId = paramWt.Id,
            //           LabId = labGp.Id
            //       }
            //    );
            //}

            //if (!context.ParameterGroups.Any(g => g.GroupId == group.Id &&
            //                               g.ParameterId == paramP.Id &&
            //                               g.LabId == labGp.Id))
            //{
            //    context.ParameterGroups.AddOrUpdate(
            //        e => e.Id,
            //       new Models.ParameterGroup
            //       {
            //           GroupId = group.Id,
            //           ParameterId = paramP.Id,
            //           LabId = labGp.Id,
            //           DetectionLimit = 0.2m
            //       }
            //    );
            //}

            //var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            //var UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));


            //// first we create Admin rool   
            //var role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
            //role.Name = "Admin";
            //roleManager.Create(role);

            ////
            //role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
            //role.Name = "Officer";
            //roleManager.Create(role);

            ////Create Manager Role
            //role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
            //role.Name = "Member";
            //roleManager.Create(role);

            //// Creating Coordinator role    
            //role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
            //role.Name = "Coordinator";
            //roleManager.Create(role);

            //// Creating Monitor role   
            //role = new Microsoft.AspNet.Identity.EntityFramework.IdentityRole();
            //role.Name = "Monitor";
            //roleManager.Create(role);


            ////Here we create a Admin/QA Officer super user who will maintain the website                  

            //var user = new ApplicationUser();
            //string userName = WebConfigurationManager.AppSettings["adminName"];
            //string userPWD = WebConfigurationManager.AppSettings["adminPassword"];
            

            //user.UserName = userName;
            //user.Email = userName;
            //user.EmailConfirmed = true;
            //user.GroupId = (group != null) ? group.Id : 1;
            //user.FirstName = "Dave";
            //user.LastName = "Parrish";
            //user.Status = true;
            //user.GroupUpdatedDateTime = Convert.ToDateTime("2016-1-1 12:00:00");
            //user.State = "VA";
            //user.VolunteerHours = 120.5M; //use 'm' here to identify decimal type
            //var chkUser = UserManager.Create(user, userPWD);
            ////Add default User to Role Admin   
            //if (chkUser.Succeeded)
            //{
            //    var result1 = UserManager.AddToRole(user.Id, "Admin");
            //}

            //string userNameOfficer = WebConfigurationManager.AppSettings["officerName"];
            //string userPWDOfficer = WebConfigurationManager.AppSettings["officerPassword"];
            ////Create Default Officer
            //var userOfficer = new ApplicationUser();
            //userOfficer.UserName = userNameOfficer;
            //userOfficer.Email = userNameOfficer;
            //user.EmailConfirmed = true;
            //userOfficer.GroupId = (group != null) ? group.Id : 1;
            //userOfficer.FirstName = "John";
            //userOfficer.LastName = "Officer";
            //userOfficer.Status = true;
            //userOfficer.State = "VA";
            //var chkUserOfficer = UserManager.Create(userOfficer, userPWDOfficer);

            ////Add default User to Role Officer   
            //if (chkUserOfficer.Succeeded)
            //{
            //    var result1 = UserManager.AddToRole(userOfficer.Id, "Officer");
            //}

            //string userNameMember = WebConfigurationManager.AppSettings["memberName"];
            //string userPWDMember = WebConfigurationManager.AppSettings["memberPassword"];
            ////Create default Member
            //var userMember = new ApplicationUser();
            //userMember.UserName = userNameMember;
            //userMember.Email = userNameMember;
            //user.EmailConfirmed = true;
            //userMember.GroupId = (group != null) ? group.Id : 1;
            //userMember.FirstName = "Jane";
            //userMember.LastName = "Member";
            //userMember.State = "VA";
            //userMember.Status = true;
            //var chkUserMember = UserManager.Create(userMember, userPWDMember);
            ////Add default User to Role Member   
            //if (chkUserMember.Succeeded)
            //{
            //    var result1 = UserManager.AddToRole(userMember.Id, "Member");
            //}

            //string userNameCoordinator = WebConfigurationManager.AppSettings["coordinatorName"];
            //string userPWDCoordinator = WebConfigurationManager.AppSettings["coordinatorPassword"];
            ////Create default Coordinator
            //var userCoordinator = new ApplicationUser();
            //userCoordinator.UserName = userNameCoordinator;
            //user.EmailConfirmed = true;
            //userCoordinator.Email = userNameCoordinator;
            //userCoordinator.GroupId = (group != null) ? group.Id : 1;
            //userCoordinator.FirstName = "Dave";
            //userCoordinator.LastName = "Coordinator";
            //userCoordinator.State = "VA";
            //userCoordinator.Status = true;
            //var chkUserCoordinator = UserManager.Create(userCoordinator, userPWDCoordinator);

            ////Add default User to Role Coordinator   
            //if (chkUserCoordinator.Succeeded)
            //{
            //    var result1 = UserManager.AddToRole(userCoordinator.Id, "Coordinator");
            //}
            //string userNameMonitor = WebConfigurationManager.AppSettings["monitorName"];
            //string userPWDMonitor = WebConfigurationManager.AppSettings["monitorPassword"];
            ////Create default Monitor
            //var userMonitor = new ApplicationUser();
            //userMonitor.UserName = userNameMonitor;
            //userMonitor.Email = userNameMonitor;
            //user.EmailConfirmed = true;
            //userMonitor.GroupId = (group != null) ? group.Id : 1;
            //userMonitor.FirstName = "Katie";
            //userMonitor.LastName = "Monitor";
            //userMonitor.Status = true;
            //userMonitor.State = "VA";
            //userMonitor.Code = group.Code + "." + userMonitor.FirstName + "." + userMonitor.LastName;
            //var chkUserMonitor = UserManager.Create(userMonitor, userPWDMonitor);
            ////Add default User to Role Monitor   
            //if (chkUserMonitor.Succeeded)
            //{
            //    var result1 = UserManager.AddToRole(userMonitor.Id, "Monitor");
            //}
        }

    }
}

