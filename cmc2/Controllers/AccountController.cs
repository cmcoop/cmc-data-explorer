using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using cmc2.Models;
using System.Data.Entity;
using System.IO;
using cmc2.Helpers;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Text.RegularExpressions;

namespace cmc2.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager )
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

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

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            
            if (user == null)
            {
                ModelState.AddModelError("", "Couldn't find a CMC account attached to this username.");
                return View(model);
            }

            if (user.EmailConfirmed == false)
            {
                string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking here:  " + callbackUrl);

                return View("EmailNotConfirmed");
            }

            if (user != null && user.Status == true)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, change to shouldLockout: true
                var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: false);
                switch (result)
                {   
                    case SignInStatus.Success:
                    
                            return RedirectToLocal(returnUrl);
                    
                    case SignInStatus.LockedOut:
                        return View("Lockout");
                    case SignInStatus.RequiresVerification:
                        return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                    case SignInStatus.Failure:
                    default:
                        ModelState.AddModelError("", "Invalid login attempt.");
                        return View(model);
                }
            }
            else
            {
                return View(model);
            }
        }

        //
        // GET: /Account/VerifyCode
        [AllowAnonymous]
        public async Task<ActionResult> VerifyCode(string provider, string returnUrl, bool rememberMe)
        {
            // Require that the user has already logged in via username/password or external login
            if (!await SignInManager.HasBeenVerifiedAsync())
            {
                return View("Error");
            }
            return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/VerifyCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> VerifyCode(VerifyCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // The following code protects for brute force attacks against the two factor codes. 
            // If a user enters incorrect codes for a specified amount of time then the user account 
            // will be locked out for a specified amount of time. 
            // You can configure the account lockout settings in IdentityConfig
            var result = await SignInManager.TwoFactorSignInAsync(model.Provider, model.Code, isPersistent:  model.RememberMe, rememberBrowser: model.RememberBrowser);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(model.ReturnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid code.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public async Task<ActionResult> Register()
        {
            var context = new ApplicationDbContext();
            var groupList = context.Groups.OrderBy(x=>x.Name).ToListAsync();
            ViewBag.GroupName = new SelectList(await groupList, "Name", "Name");
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register([Bind(Exclude = "ProfileImage")]RegisterViewModel model)
        {
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var context = new ApplicationDbContext();
            if (ModelState.IsValid)
            {
                // To convert the user uploaded Photo as Byte Array before save to DB 
                byte[] imageData = null;
                
                HttpPostedFileBase poImgFile = Request.Files["ProfileImage"];
                if (poImgFile != null && poImgFile.ContentLength != 0)
                {
                    Image uploaded = Image.FromStream(poImgFile.InputStream, true, true);
                    int originalWidth = uploaded.Width;
                    int originalHeight = uploaded.Height;
                    float percentWidth = (float)256 / (float)originalWidth;
                    float percentHeight = (float)256 / (float)originalHeight;
                    float percent = percentHeight < percentWidth ? percentHeight : percentWidth;
                    int newWidth = (int)(originalWidth * percent);
                    int newHeight = (int)(originalHeight * percent);
                    //using (var binary = new BinaryReader(poImgFile.InputStream))
                    //{
                    //    imageData = binary.ReadBytes(poImgFile.ContentLength);
                    //}
                    Image newImage = new Bitmap(newWidth, newHeight);
                    using (Graphics g = Graphics.FromImage(newImage))
                    {
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.DrawImage(uploaded, 0, 0, newWidth, newHeight);
                    }

                    using (MemoryStream ms = new MemoryStream())
                    {
                        ImageCodecInfo codec = ImageCodecInfo.GetImageEncoders().FirstOrDefault(c => c.FormatID == ImageFormat.Jpeg.Guid);
                        EncoderParameters jpegParms = new EncoderParameters(1);
                        jpegParms.Param[0] = new EncoderParameter(Encoder.Quality, 95L);
                        newImage.Save(ms, codec, jpegParms);
                        imageData = ms.ToArray();
                    }
                }
                

                
                user.GroupId = context.Groups
                    .FirstOrDefault(g => g.Name
                    .Contains(model.Group)).Id;
                var GroupCode = context.Groups
                    .FirstOrDefault(g => g.Name
                    .Contains(model.Group)).Code;

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                
                var userCode = GroupCode + '.' + model.FirstName + '.' + model.LastName;
                Regex.Replace(userCode, @"\s+", "");
                if (!context.Users.Any(u => u.Code.Equals(userCode)))
                {
                    user.Code = userCode;
                } else
                {

                    string existingCode;  string numUser; int i;
                    System.Collections.Generic.List<DateTime> datelist = context.Users.Where(u => u.Code.StartsWith(userCode)).Select(u=>u.CreatedDate).ToList();
                    DateTime maxDate = datelist.Max();
                    existingCode = context.Users.FirstOrDefault(u => u.Code.StartsWith(userCode) && u.CreatedDate.Equals(maxDate)).Code;
                    numUser = existingCode.Substring(existingCode.LastIndexOf('.') + 1);
                    bool success = int.TryParse(numUser, out i);
                    if (success)
                    {
                        i = i + 1;
                        user.Code = existingCode.Substring(0,existingCode.LastIndexOf('.') + 1) + i;
                    }
                    else
                    {
                        user.Code = userCode + '.' + '1';
                    }
                    
                }
                if (model.CellPhone != null)
                {
                    user.CellPhone = Extensions.GetNumbers(model.CellPhone);
                }else
                {
                    user.CellPhone = model.CellPhone;
                }
                if (model.HomePhone != null)
                {
                    user.HomePhone = Extensions.GetNumbers(model.HomePhone);
                }
                else
                {
                    user.HomePhone = model.HomePhone;
                }
                if (model.EmergencyPhone != null)
                {
                    user.EmergencyPhone = Extensions.GetNumbers(model.EmergencyPhone);
                }
                else
                {
                    user.CellPhone = model.EmergencyPhone;
                }
                user.HasBeenActivated = false;
                user.AddressFirst = model.AddressFirst;
                user.AddressSecond = model.AddressSecond;
                user.City = model.City;
                user.State = model.State;
                user.Zip = model.Zip;
                user.CreatedDate = DateTime.Now;
                user.ModifiedDate = DateTime.Now;
                user.CertificationDate = DateTime.Now;
                //Here we pass the byte array to user context to store in db 
                user.ProfileImage = imageData;

                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    //await SignInManager.SignInAsync(user, isPersistent:false, rememberBrowser:false);
                    user.CreatedBy = user.Id;
                    
                    user.ModifiedBy = user.Id;
                    
                    await UserManager.UpdateAsync(user);
                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                    // Send an email with this link
                    string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    await UserManager.SendEmailAsync(user.Id, "Confirm your account", "Please confirm your account by clicking here:  " + callbackUrl);
                    //ViewBag.Link = callbackUrl;
                    return View("DisplayEmail");
                    
                }
               
                AddErrors(result);
            }
            var groupList = context.Groups.ToListAsync();
            ViewBag.GroupName = new SelectList(await groupList, "Name", "Name");
            // If we got this far, something failed, redisplay form

            return View(model);
        }

        //
        // GET: /Account/ConfirmEmail
        [AllowAnonymous]
        public async Task<ActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var newUser = await UserManager.FindByIdAsync(userId);
            if (!(await UserManager.IsEmailConfirmedAsync(newUser.Id)))
            {
                var result = await UserManager.ConfirmEmailAsync(userId, code);
                
                if (result.Succeeded)
                {
                    var result1 = UserManager.AddToRole(userId, "Monitor");
                    var context = new ApplicationDbContext();
                    var userGroup = context.Users.FirstOrDefault(u => u.Id.Equals(userId)).GroupId;
                    var coordinatorRole = context.Roles
                        .Where(m => m.Name.Equals("Coordinator"))
                        .Select(m => m.Id).ToList();
                    var coordinatorUsers = context.Users
                        .Where(m => m.Roles
                        .Any(r => coordinatorRole.Contains(r.RoleId)));
                    if (coordinatorUsers.Any(u => u.GroupId.Equals(userGroup)))
                    {
                        var userCoordinatorEmails = coordinatorUsers.Where(
                                                            u => u.GroupId.Equals(userGroup) && u.Status == true).Select(m=>m.Id).ToList();
                        foreach(var uce in userCoordinatorEmails)
                        {
                            await UserManager.SendEmailAsync(uce, "You have a new user",
                            "A new user, " + newUser.FirstName + " " + newUser.LastName +
                            ", in your group that has registered for access to the CMC Data Portal.  " +
                            "Please login to the Chesapeake Monitoring Cooperative website " +
                            "and activate the new user.");
                        }
                        
                    }
                    else
                    {
                        var memberRole = context.Roles
                        .Where(m => m.Name.Equals("Member"))
                        .Select(m => m.Id).ToList();
                        var memberUsers = context.Users
                            .Where(m => m.Roles
                            .Any(r => memberRole.Contains(r.RoleId)));
                        var userMemberEmail = memberUsers.Select(m => m.Id).ToListAsync();
                        foreach (var m in await userMemberEmail)
                        {
                            await UserManager.SendEmailAsync(m, "You have a new user",
                            "A new user, " + newUser.FirstName + " " + newUser.LastName + ", has registered for access to the CMC Data Portal.  " +
                            "Please login to the Chesapeake Monitoring Cooperative website " +
                            "and activate the new user.");
                        }
                    }

                    var adminRole = context.Roles
                        .Where(m => m.Name.Equals("Admin") | m.Name.Equals("Officer"))
                        .Select(m => m.Id).ToList();
                    var memberAdminUsers = context.Users
                        .Where(m => m.Roles
                        .Any(r => adminRole.Contains(r.RoleId)));
                    var adminMemberEmail = memberAdminUsers.Select(m => m.Id).ToListAsync();
                    foreach (var m in await adminMemberEmail)
                    {
                        await UserManager.SendEmailAsync(m, "You have a new user",
                        "A new user, " + newUser.FirstName + " " + newUser.LastName + ", has registered for access to the CMC Data Portal.  " +
                        "Please login to the Chesapeake Monitoring Cooperative website " +
                        "and activate the new user.");
                    }                
                }
                return View(result.Succeeded ? "ConfirmEmail" : "Error");
            }
            return View("ConfirmEmail");
        }
        
        //
        // GET: /Account/ForgotPassword
        [AllowAnonymous]
        public ActionResult ForgotPassword()
        {
            return View();
        }

        //
        // POST: /Account/ForgotPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var context = new ApplicationDbContext();
                
                var user = UserManager.FindByEmail(model.Email);
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return View("ForgotPasswordConfirmation");
                }

                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
                // Send an email with this link
                string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                await UserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking this link or pasting it in your browser: \n" + callbackUrl);
                return RedirectToAction("ForgotPasswordConfirmation", "Account");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        // GET: /Account/CreatePasswordConfirmation
        [AllowAnonymous]
        public ActionResult CreatePasswordConfirmation()
        {
            return View();
        }


        //
        // GET: /Account/ForgotPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ForgotPasswordConfirmation()
        {
            return View();
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await UserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        //
        // POST: /Account/ExternalLogin
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult ExternalLogin(string provider, string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult(provider, Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl }));
        }

        //
        // GET: /Account/SendCode
        [AllowAnonymous]
        public async Task<ActionResult> SendCode(string returnUrl, bool rememberMe)
        {
            var userId = await SignInManager.GetVerifiedUserIdAsync();
            if (userId == null)
            {
                return View("Error");
            }
            var userFactors = await UserManager.GetValidTwoFactorProvidersAsync(userId);
            var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
            return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        }

        //
        // POST: /Account/SendCode
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SendCode(SendCodeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            // Generate the token and send it
            if (!await SignInManager.SendTwoFactorCodeAsync(model.SelectedProvider))
            {
                return View("Error");
            }
            return RedirectToAction("VerifyCode", new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        }

        //
        // GET: /Account/ExternalLoginCallback
        [AllowAnonymous]
        public async Task<ActionResult> ExternalLoginCallback(string returnUrl)
        {
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            // Sign in the user with this external login provider if the user already has a login
            var result = await SignInManager.ExternalSignInAsync(loginInfo, isPersistent: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToLocal(returnUrl);
                case SignInStatus.LockedOut:
                    return View("Lockout");
                case SignInStatus.RequiresVerification:
                    return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = false });
                case SignInStatus.Failure:
                default:
                    // If the user does not have an account, then prompt the user to create an account
                    ViewBag.ReturnUrl = returnUrl;
                    ViewBag.LoginProvider = loginInfo.Login.LoginProvider;
                    return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = loginInfo.Email });
            }
        }

        //
        // POST: /Account/ExternalLoginConfirmation
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Manage");
            }

            if (ModelState.IsValid)
            {
                // Get the information about the user from the external login provider
                var info = await AuthenticationManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    return View("ExternalLoginFailure");
                }
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await UserManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    result = await UserManager.AddLoginAsync(user.Id, info.Login);
                    if (result.Succeeded)
                    {
                        await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                        return RedirectToLocal(returnUrl);
                    }
                }
                AddErrors(result);
            }

            ViewBag.ReturnUrl = returnUrl;
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/ExternalLoginFailure
        [AllowAnonymous]
        public ActionResult ExternalLoginFailure()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helpers
        // Used for XSRF protection when adding external logins
        private const string XsrfKey = "XsrfId";

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}