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
using cmc2.Helpers;

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Group>("Groups");
    builder.EntitySet<ParameterGroup>("ParameterGroups"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
 
    public class GroupsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/Groups
        [EnableQuery]
        public IQueryable<Group> GetGroups()
        {
            return db.Groups;
        }

        // GET: odata/Groups(5)
        [EnableQuery]
        public SingleResult<Group> GetGroup([FromODataUri] int key)
        {
            return SingleResult.Create(db.Groups.Where(group => group.Id == key));
        }

        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        // PUT: odata/Groups(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Group> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Group group = await db.Groups.FindAsync(key);
            if (group == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyGroupEditPermission(group);

            if (check)
            {
                patch.Put(group);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GroupExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(group);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        // POST[Authorize]: odata/Groups
        public async Task<IHttpActionResult> Post(Group group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var check = AuthorizeLogic.VerifyGroupEditPermission(group);

            if (check)
            {
                db.Groups.Add(group);
                await db.SaveChangesAsync();

                return Created(group);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        // PATCH: odata/Groups(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Group> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Group group = await db.Groups.FindAsync(key);
            if (group == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyGroupEditPermission(group);

            if (check)
            {
                patch.Patch(group);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GroupExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(group);
            }
            else
            {
                return Unauthorized();
            }

           
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        // DELETE: odata/Groups(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Group group = await db.Groups.FindAsync(key);
            if (group == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyGroupEditPermission(group);

            if (check)
            {
                db.Groups.Remove(group);
                await db.SaveChangesAsync();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }            
        }
        [Authorize]
        // GET: odata/Groups(5)/ParameterGroups
        [EnableQuery]
        public IQueryable<ParameterGroup> GetParameterGroups([FromODataUri] int key)
        {
            return db.Groups.Where(m => m.Id == key).SelectMany(m => m.ParameterGroups);
        }
        [Authorize]
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        [Authorize]
        private bool GroupExists(int key)
        {
            return db.Groups.Count(e => e.Id == key) > 0;
        }
    }
}
