using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.ModelBinding;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using cmc2.Models;
using System.Text.RegularExpressions;

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<ApplicationUser>("ApplicationUsers");
    builder.EntitySet<IdentityUserClaim>("IdentityUserClaims"); 
    builder.EntitySet<Group>("Groups"); 
    builder.EntitySet<IdentityUserLogin>("IdentityUserLogins"); 
    builder.EntitySet<IdentityUserRole>("IdentityUserRoles"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class ApplicationUsersController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        [Authorize]
        // GET: odata/ApplicationUsers
        [EnableQuery]
        public IQueryable<UserViewModel> GetApplicationUsers()
        {
            return db.GetApplicationUsers().Select(x => new UserViewModel {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                State = x.State,
                GroupId = x.GroupId,
                Group = x.Group,
                Email = x.Email,
                Status = x.Status,
                Role = x.Roles.Select(c => c.RoleId).FirstOrDefault().ToString(),
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate

            });

        }
        [Authorize]
        // GET: odata/ApplicationUsers(5)
        [EnableQuery]
        public SingleResult<UserViewModel> GetApplicationUser([FromODataUri] string key)
        {
            return SingleResult.Create(db.GetApplicationUsers().Where(x => x.Id == key).Select(x => new UserViewModel
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                State = x.State,
                Status = x.Status,
                GroupId = x.GroupId

            }));
        }
        
     

        // Other controller methods not shown.

        //// PUT: odata/ApplicationUsers(5)
        //public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<ApplicationUser> patch)
        //{
        //    Validate(patch.GetEntity());

        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    ApplicationUser applicationUser = await db.GetApplicationUsers().FindAsync(key);
        //    if (applicationUser == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Put(applicationUser);

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (db.GetApplicationUsers().FindAsync(key)==null)
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(applicationUser);
        //}

        //    // POST: odata/ApplicationUsers
        //    public async Task<IHttpActionResult> Post(ApplicationUser applicationUser)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        db.ApplicationUsers.Add(applicationUser);

        //        try
        //        {
        //            await db.SaveChangesAsync();
        //        }
        //        catch (DbUpdateException)
        //        {
        //            if (ApplicationUserExists(applicationUser.Id))
        //            {
        //                return Conflict();
        //            }
        //            else
        //            {
        //                throw;
        //            }
        //        }

        //        return Created(applicationUser);
        //    }

        //// PATCH: odata/ApplicationUsers(5)
        //[AcceptVerbs("PATCH", "MERGE")]
        //public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<ApplicationUser> patch)
        //{
        //    Validate(patch.GetEntity());

        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    ApplicationUser applicationUser = await db.GetApplicationUsers().FindAsync(key);
        //    if (applicationUser == null)
        //    {
        //        return NotFound();
        //    }

        //    patch.Put(applicationUser);

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (db.GetApplicationUsers().FindAsync(key) == null)
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return Updated(applicationUser);
        //}

        //    // DELETE: odata/ApplicationUsers(5)
        //    public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        //    {
        //        ApplicationUser applicationUser = await db.ApplicationUsers.FindAsync(key);
        //        if (applicationUser == null)
        //        {
        //            return NotFound();
        //        }

        //        db.ApplicationUsers.Remove(applicationUser);
        //        await db.SaveChangesAsync();

        //        return StatusCode(HttpStatusCode.NoContent);
        //    }

        //    // GET: odata/ApplicationUsers(5)/Claims
        //    [EnableQuery]
        //    public IQueryable<IdentityUserClaim> GetClaims([FromODataUri] string key)
        //    {
        //        return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.Claims);
        //    }

        //    // GET: odata/ApplicationUsers(5)/Group
        //    [EnableQuery]
        //    public SingleResult<Group> GetGroup([FromODataUri] string key)
        //    {
        //        return SingleResult.Create(db.ApplicationUsers.Where(m => m.Id == key).Select(m => m.Group));
        //    }

        //    // GET: odata/ApplicationUsers(5)/Logins
        //    [EnableQuery]
        //    public IQueryable<IdentityUserLogin> GetLogins([FromODataUri] string key)
        //    {
        //        return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.Logins);
        //    }

        //    // GET: odata/ApplicationUsers(5)/Roles
        //    [EnableQuery]
        //    public IQueryable<IdentityUserRole> GetRoles([FromODataUri] string key)
        //    {
        //        return db.ApplicationUsers.Where(m => m.Id == key).SelectMany(m => m.Roles);
        //    }

        //    protected override void Dispose(bool disposing)
        //    {
        //        if (disposing)
        //        {
        //            db.Dispose();
        //        }
        //        base.Dispose(disposing);
        //    }

        //    private bool ApplicationUserExists(string key)
        //    {
        //        return db.ApplicationUsers.Count(e => e.Id == key) > 0;
        //    }
        //}
    }
}
