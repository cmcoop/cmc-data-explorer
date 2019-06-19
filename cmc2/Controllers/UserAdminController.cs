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
using System.Web.Script.Serialization;

namespace cmc2.Controllers
{
    [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
    public class UsersAdminController : Controller
    {
        public UsersAdminController()
        {
        }        

        public List<string> getRolesUserCanManage()
        {
            var roles = new List<string> { };
            if (HttpContext.User.IsInRole("Admin"))
            {
                roles = adminLogic.rolesAdminCanManage;
            }
            else if (HttpContext.User.IsInRole("Officer"))
            {
                roles = adminLogic.rolesOfficerCanManage;
            }
            else if (HttpContext.User.IsInRole("Member"))
            {
                roles = adminLogic.rolesMemberCanManage;
            }
            else if (HttpContext.User.IsInRole("Coordinator"))
            {
                roles = adminLogic.rolesCoordinatorCanManage;
            }
            return (roles);
        }

        public UsersAdminController(ApplicationUserManager userManager, ApplicationRoleManager roleManager)
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        private ApplicationRoleManager _roleManager;
        

        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.GetOwinContext().Get<ApplicationRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }

        // GET: /Users/
        public ActionResult Index()
        {
            var context = new ApplicationDbContext();
            //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();
            var user = UserManager.FindById(HttpContext.User.Identity.GetUserId());
            var roles = getRolesUserCanManage();
            List< UserViewModel > users;
            
            var role = context.Roles
                .Where(m => roles.Contains(m.Name))
                .Select(m => m.Id).ToList();
            
            if (UserManager.GetRoles(user.Id).FirstOrDefault() == "Coordinator" | UserManager.GetRoles(user.Id).FirstOrDefault() == "Monitor") 
            {
                users = context.Users
                    .Where(m => m.Roles
                    .Any(r => role.Contains(r.RoleId)) & m.GroupId.Equals(user.GroupId))
                    .Select(o => new UserViewModel
                    {
                        Code = o.Code,
                        Id = o.Id,
                        FirstName = o.FirstName,
                        LastName = o.LastName,
                        Email = o.Email,
                        State = o.State,
                        Group = o.Group,
                        Status = o.Status,
                        EmailConfirmed = o.EmailConfirmed,
                        HasBeenActivated = o.HasBeenActivated,
                        CreatedDate = o.CreatedDate,
                        ModifiedDate = o.ModifiedDate

                    })
                    //.Include(g => g.Group)

                    .ToList();
                foreach (var usr in users)
                {
                    usr.Role = UserManager.GetRoles(usr.Id).FirstOrDefault();
                }
            } else {
                users = context.Users
                    .Where(m => m.Roles
                    .Any(r => role.Contains(r.RoleId)))
                    .Select(o => new UserViewModel
                    {
                        Code = o.Code,
                        Id = o.Id,
                        FirstName = o.FirstName,
                        LastName = o.LastName,
                        Email = o.Email,
                        State = o.State,
                        Group = o.Group,
                        Status = o.Status,
                        HasBeenActivated = o.HasBeenActivated,
                        EmailConfirmed = o.EmailConfirmed,
                        CreatedDate = o.CreatedDate,
                        ModifiedDate = o.ModifiedDate

                    })
                    //.Include(g => g.Group)

                    .ToList();
                foreach (var usr in users)
                {
                    usr.Role = UserManager.GetRoles(usr.Id).FirstOrDefault();
                }
            }

            

            var jsonUsers = new JavaScriptSerializer().Serialize(users);
            ViewBag.jsonUsers = jsonUsers;
            ViewBag.userName = user.FirstName;
            ViewBag.userGroupName = context.Groups.Where(m => m.Id.Equals(user.GroupId)).FirstOrDefault().Name;
            ViewBag.userRole = UserManager.GetRoles(user.Id).FirstOrDefault();
            return View();
        }


        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = UserManager.FindById(id);
            if (user == null)
            {
                return HttpNotFound();
            }

            var context = new ApplicationDbContext();
            var roles = getRolesUserCanManage();
            var clientUserId = User.Identity.GetUserId();

            ViewBag.clientId = clientUserId;

            //Get the list of Roles to attach to new user
            var roleList = context.Roles.OrderBy(i=>i.Name == "Admin")
                .ThenBy(i => i.Name == "Officer")
                .ThenBy(i => i.Name == "Member")
                .ThenBy(i => i.Name == "Coordinator")
                .ThenBy(i => i.Name == "Monitor")
                .Where(m => roles.Contains(m.Name));
            //var roleSelectList = new SelectList(roleList, "Name", "Name");
            var groupList = context.Groups.OrderBy(i=>i.Name);

            var statesList = cmc2.Helpers.Extensions.GetStatesList();

            var userRoles = UserManager.GetRoles(user.Id);
            var editUser = new EditUserViewModel()
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Status = user.Status,
                    CellPhone = user.CellPhone,
                    HomePhone = user.HomePhone,
                    EmergencyPhone = user.EmergencyPhone,
                    AddressFirst = user.AddressFirst,
                    AddressSecond = user.AddressSecond,
                    City = user.City,
                    State = user.State,
                    Zip = user.Zip,
                    Code = user.Code,
                    GroupUpdatedDateTime = user.GroupUpdatedDateTime,
                    //VolunteerHours = user.VolunteerHours,
                    CertificationDate = user.CertificationDate,                    
                    sendEmail = false                   
                };

            var RolesList = roleList.Select(x => new SelectListItem()
            {
                Selected = userRoles.Contains(x.Name),
                Text = x.Name,
                Value = x.Name
            });

            var GroupList = groupList.Select(x => new SelectListItem()
            {
                Selected = x.Id.Equals(user.GroupId),
                Text = x.Name,
                Value = x.Name
            });

            var StateList = statesList.Select(x => new SelectListItem()
            {
                Selected = x.Value.Equals(user.State),
                Text = x.Text,
                Value = x.Value
            });


            ViewBag.RolesList = RolesList;
            ViewBag.GroupList = GroupList;
            ViewBag.StateList = StateList;
            return PartialView(editUser);
        }

        //
        // POST: /Users/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Email,Id,FirstName,LastName,Status,sendEmail,CellPhone,HomePhone,AddressFirst,AddressSecond,City,State,Zip,EmergencyPhone,GroupUpdatedDateTime,VolunteerHours,Code,CertificationDate")] EditUserViewModel editUser, string selectedGroup, params string[] selectedRole)
        {
            var context = new ApplicationDbContext();
            var userRoles = UserManager.GetRoles(editUser.Id);
            var roles = getRolesUserCanManage();
            var clientUserId = User.Identity.GetUserId();

            ViewBag.clientId = clientUserId;

            //Get the list of Roles to attach to new user
            var roleList = context.Roles.OrderBy(i => i.Name == "Admin")
                .ThenBy(i => i.Name == "Officer")
                .ThenBy(i => i.Name == "Member")
                .ThenBy(i => i.Name == "Coordinator")
                .ThenBy(i => i.Name == "Monitor")
                .Where(m => roles.Contains(m.Name));
            //var roleSelectList = new SelectList(roleList, "Name", "Name");
            var groupList = context.Groups;

            var statesList = cmc2.Helpers.Extensions.GetStatesList();


            var RolesList = roleList.Select(x => new SelectListItem()
            {
                Selected = userRoles.Contains(x.Name),
                Text = x.Name,
                Value = x.Name
            });

            var GroupList = groupList.Select(x => new SelectListItem()
            {
                Selected = x.Id.Equals(editUser.GroupId),
                Text = x.Name,
                Value = x.Name
            });

            var StateList = statesList.Select(x => new SelectListItem()
            {
                Selected = x.Value.Equals(editUser.State),
                Text = x.Text,
                Value = x.Value
            });
            ViewBag.RolesList = RolesList;
            ViewBag.GroupList = GroupList;
            ViewBag.StateList = StateList;
            if (ModelState.IsValid)
            {
                var user = UserManager.FindById(editUser.Id);
                if (user == null)
                {
                    return HttpNotFound();
                } else {
                    var userByEmail = UserManager.FindByEmail(editUser.Email);
                    if (userByEmail.Id != user.Id)
                    {
                        ViewBag.test = "foundEmail";
                        return PartialView(editUser);
                    }
                }



                    user.UserName = editUser.Email;
                user.Email = editUser.Email;
                user.FirstName = editUser.FirstName;
                user.LastName = editUser.LastName;
                user.Status = editUser.Status;
                user.CellPhone = editUser.CellPhone;
                user.HomePhone = editUser.HomePhone;
                user.EmergencyPhone = editUser.EmergencyPhone;
                user.AddressFirst = editUser.AddressFirst;
                user.AddressSecond = editUser.AddressSecond;
                user.City = editUser.City;
                user.State = editUser.State;
                user.Zip = editUser.Zip;
                user.Code = editUser.Code;
                user.GroupUpdatedDateTime = editUser.GroupUpdatedDateTime;
                //user.VolunteerHours = editUser.VolunteerHours;
                user.CertificationDate = editUser.CertificationDate;
                user.ModifiedBy = HttpContext.User.Identity.GetUserId();
                user.ModifiedDate = DateTime.Now;
                
                user.GroupId = context.Groups.FirstOrDefault(g => g.Name.Contains(selectedGroup)).Id;


                

                selectedRole = selectedRole ?? new string[] { };

                var result = UserManager.AddToRoles(user.Id, selectedRole.Except(userRoles).ToArray<string>());

                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());

                    return View();
                }
                result = UserManager.RemoveFromRoles(user.Id, userRoles.Except(selectedRole).ToArray<string>());

                if (!result.Succeeded)
                {
                    ModelState.AddModelError("", result.Errors.First());

                    return View();
                }

                if (editUser.sendEmail == true & editUser.Status == true)
                {
                    UserManager.SendEmail(user.Id, "CMC account is activated", "Your account has been activated by a CMC member. You now have access to the CMC Data Portal.");
                }
                else if (editUser.sendEmail == true & editUser.Status == false)
                {
                    UserManager.SendEmail(user.Id, "CMC account is deactivated", "Your account has been deactivated by a CMC member. You may no longer access to the CMC Data Portal.");
                }
                ViewBag.test = "true";
                return PartialView("EditSuccess");
            }

            
            
            ViewBag.test = "false";
            //ModelState.AddModelError("", "Something failed.");
            //do stuff
            return PartialView(editUser);
        }
        //
        //// GET: /UsersAdmin/Details/1435b9e7-1e93-4931-91ae-e043e0551c82
        //public async Task<ActionResult> Details(string id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }

        //    var context = new ApplicationDbContext();
        //    //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();
        //    var roles = getRolesUserCanManage();

        //    var user = await UserManager.FindByIdAsync(id);

        //    var userRoles = await UserManager.GetRolesAsync(user.Id);

        //    if (roles.Contains(userRoles.First())){
        //        ViewBag.RoleNames = userRoles;
        //        ViewBag.GroupName = context.Groups.Where(g => g.Id.Equals(user.GroupId)).Select(n => n.Name);
        //        return View(user);
        //    }else
        //    {
        //        return View("~/Views/Account/Login.cshtml");
        //    }            
        //}

        ////
        //// GET: /Users/Create
        //public async Task<ActionResult> Create()
        //{
        //    var context = new ApplicationDbContext();
        //    var roles = getRolesUserCanManage();

        //    //Get the list of Roles to attach to new user
        //    var roleList = context.Roles
        //        .Where(m => roles.Contains(m.Name)).ToListAsync();
        //    ViewBag.RoleId = new SelectList(await roleList, "Name", "Name");
        //    var groupList = context.Groups.ToListAsync();            
        //    ViewBag.GroupName = new SelectList(await groupList, "Name", "Name");
        //    return View();
        //}

        ////
        //// POST: /Users/Create
        //[HttpPost]
        //public async Task<ActionResult> Create(RegisterViewModel userViewModel, params string[] selectedRoles)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        var context = new ApplicationDbContext();
        //        var user = new ApplicationUser { UserName = userViewModel.Email, Email = userViewModel.Email };
        //        user.GroupId = context.Groups
        //            .FirstOrDefault(g => g.Name
        //            .Contains(userViewModel.Group)).Id;
        //        var adminresult = await UserManager.CreateAsync(user, userViewModel.Password);

        //        //Add User to the selected Roles 
        //        if (adminresult.Succeeded)
        //        {
        //            if (selectedRoles != null)
        //            {
        //                var result = await UserManager.AddToRolesAsync(user.Id, selectedRoles);
        //                if (!result.Succeeded)
        //                {
        //                    ModelState.AddModelError("", result.Errors.First());
        //                    ViewBag.RoleId = new SelectList(await RoleManager.Roles.ToListAsync(), "Name", "Name");
        //                    return View();
        //                }
        //            }
        //        }
        //        else
        //        {
        //            ModelState.AddModelError("", adminresult.Errors.First());
        //            ViewBag.RoleId = new SelectList(RoleManager.Roles, "Name", "Name");
        //            return View();

        //        }
        //        return RedirectToAction("Index");
        //    }
        //    ViewBag.RoleId = new SelectList(RoleManager.Roles, "Name", "Name");
        //    return View();
        //}

        //
        // GET: /Users/Edit/1


        //
        // GET: /Users/Delete/5
        //[Authorize(Roles = "Admin")]
        //public async Task<ActionResult> Delete(string id)
        //{
            
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    var user = await UserManager.FindByIdAsync(id);
        //    if (user == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(user);
        //}

        ////
        //// POST: /Users/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //[Authorize(Roles = "Admin")]
        //public async Task<ActionResult> DeleteConfirmed(string id)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        if (id == null)
        //        {
        //            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //        }

        //        var user = await UserManager.FindByIdAsync(id);
        //        if (user == null)
        //        {
        //            return HttpNotFound();
        //        }
        //        var result = await UserManager.DeleteAsync(user);
        //        if (!result.Succeeded)
        //        {
        //            ModelState.AddModelError("", result.Errors.First());
        //            return View();
        //        }
        //        return RedirectToAction("Index");
        //    }
        //    return View();
        //}

        //
        // GET: /Users/Retire/5
        [Authorize(Roles = "Admin,Officer,Member,Coordinator")]
        public async Task<ActionResult> Retire(string id)
        {

            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var context = new ApplicationDbContext();
            var roles = getRolesUserCanManage();
            var roleList = context.Roles.OrderBy(i => i.Name == "Admin")
                .ThenBy(i => i.Name == "Officer")
                .ThenBy(i => i.Name == "Member")
                .ThenBy(i => i.Name == "Coordinator")
                .ThenBy(i => i.Name == "Monitor")
                .Where(m => roles.Contains(m.Name));
            var user = await UserManager.FindByIdAsync(id);
            var userRoles = await UserManager.GetRolesAsync(user.Id);
            var RolesList = roleList.Select(x => new SelectListItem()
            {
                Selected = userRoles.Contains(x.Name),
                Text = x.Name,
                Value = x.Name
            });

            ViewBag.RolesList = RolesList;
            if (user == null)
            {
                return HttpNotFound();
            }
            return PartialView(user);
        }

        
        //
        // POST: /Users/Retire/5
        [HttpPost, ActionName("Retire")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Officer,Member,Coordinator")]        
        public async Task<ActionResult> RetireConfirmed(string id, params string[] SelectedRole)
        {
            if (ModelState.IsValid)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }

                var user = await UserManager.FindByIdAsync(id);
                if (user == null)
                {
                    return HttpNotFound();
                }
                user.ModifiedBy = HttpContext.User.Identity.GetUserId();
                user.ModifiedDate = DateTime.Now;
                user.Status = !user.Status;

                if(user.Status == true & user.HasBeenActivated == false)
                {
                    user.HasBeenActivated = true;
                }
                
                if (SelectedRole != null)
                {
                    SelectedRole = SelectedRole ?? new string[] { };
                    var userRoles = await UserManager.GetRolesAsync(user.Id);

                    var result = await UserManager.AddToRolesAsync(user.Id, SelectedRole.Except(userRoles).ToArray<string>());

                    if (!result.Succeeded)
                    {
                        ModelState.AddModelError("", result.Errors.First());

                        return View();
                    }
                    result = await UserManager.RemoveFromRolesAsync(user.Id, userRoles.Except(SelectedRole).ToArray<string>());

                    if (!result.Succeeded)
                    {
                        ModelState.AddModelError("", result.Errors.First());

                        return View();
                    }
                }
                var activateResult = await UserManager.UpdateAsync(user);
                if (activateResult.Succeeded)
                {
                    if (user.Status == true)
                    {
                        await UserManager.SendEmailAsync(user.Id, "CMC account is activated", "Your account has been activated by a CMC member. You now have access to the CMC Data Portal.");
                    }
                    else if (user.Status == false)
                    {
                        await UserManager.SendEmailAsync(user.Id, "CMC account is deactivated", "Your account has been deactivated by a CMC member. You may no longer access to the CMC Data Portal.");
                    }
                    return RedirectToAction("Index");
                }
            }
            return View();
        }

        // Get: /Users/Register/5
        [Authorize(Roles = "Admin,Officer,Member,Coordinator")]
        public async Task<ActionResult> Register(string id)
        {

            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var context = new ApplicationDbContext();
            var roles = getRolesUserCanManage();
            var roleList = context.Roles.OrderBy(i => i.Name == "Admin")
                .ThenBy(i => i.Name == "Officer")
                .ThenBy(i => i.Name == "Member")
                .ThenBy(i => i.Name == "Coordinator")
                .ThenBy(i => i.Name == "Monitor")
                .Where(m => roles.Contains(m.Name));
            var user = await UserManager.FindByIdAsync(id);
            var userRoles = await UserManager.GetRolesAsync(user.Id);
            var RolesList = roleList.Select(x => new SelectListItem()
            {
                Selected = userRoles.Contains(x.Name),
                Text = x.Name,
                Value = x.Name
            });

            ViewBag.RolesList = RolesList;

            if (user == null)
            {
                return HttpNotFound();
            }
            return PartialView(user);
        }


        //
        // POST: /Users/Register/5
        [HttpPost, ActionName("Register")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Admin,Officer,Member,Coordinator")]
        public async Task<ActionResult> RegisterConfirmed(string id, string Email, params string[] SelectedRole)
        {
            if (ModelState.IsValid)
            {
                if (id == null)
                {
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
                }

                var user = await UserManager.FindByIdAsync(id);
                if (user == null)
                {
                    return HttpNotFound();
                }
                user.ModifiedBy = HttpContext.User.Identity.GetUserId();
                user.ModifiedDate = DateTime.Now;
                user.Email = Email;
                user.UserName = Email;
                user.HasBeenActivated = true;
                user.Status = true;
                if (SelectedRole != null)
                {
                    SelectedRole = SelectedRole ?? new string[] { };
                    var userRoles = await UserManager.GetRolesAsync(user.Id);

                    var result = await UserManager.AddToRolesAsync(user.Id, SelectedRole.Except(userRoles).ToArray<string>());

                    if (!result.Succeeded)
                    {
                        ModelState.AddModelError("", result.Errors.First());

                        return View();
                    }
                    result = await UserManager.RemoveFromRolesAsync(user.Id, userRoles.Except(SelectedRole).ToArray<string>());

                    if (!result.Succeeded)
                    {
                        ModelState.AddModelError("", result.Errors.First());

                        return View();
                    }
                }
                var activateResult = await UserManager.UpdateAsync(user);
                if (activateResult.Succeeded)
                {
                    string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                    var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    await UserManager.SendEmailAsync(user.Id, "Create Password", "Please create your password by clicking this link or pasting it in your browser: \n" + callbackUrl);
                    return RedirectToAction("CreatePasswordConfirmation", "Account");
                }
            }
            return View();
        }
    }
}
