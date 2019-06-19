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

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<ParameterGroup>("ParameterGroups");
    builder.EntitySet<Group>("Groups"); 
    builder.EntitySet<Parameter>("Parameters"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class ParameterGroupsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/ParameterGroups
        [EnableQuery]
        public IQueryable<ParameterGroup> GetParameterGroups()
        {
            return db.ParameterGroups;
        }

        // GET: odata/ParameterGroups(5)
        [EnableQuery]
        public SingleResult<ParameterGroup> GetParameterGroup([FromODataUri] int key)
        {
            return SingleResult.Create(db.ParameterGroups.Where(parameterGroup => parameterGroup.Id == key));
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PUT: odata/ParameterGroups(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<ParameterGroup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ParameterGroup parameterGroup = await db.ParameterGroups.FindAsync(key);
            if (parameterGroup == null)
            {
                return NotFound();
            }

            patch.Put(parameterGroup);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParameterGroupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(parameterGroup);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // POST: odata/ParameterGroups
        public async Task<IHttpActionResult> Post(ParameterGroup parameterGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ParameterGroups.Add(parameterGroup);
            await db.SaveChangesAsync();

            return Created(parameterGroup);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PATCH: odata/ParameterGroups(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<ParameterGroup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ParameterGroup parameterGroup = await db.ParameterGroups.FindAsync(key);
            if (parameterGroup == null)
            {
                return NotFound();
            }

            patch.Patch(parameterGroup);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParameterGroupExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(parameterGroup);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // DELETE: odata/ParameterGroups(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            ParameterGroup parameterGroup = await db.ParameterGroups.FindAsync(key);
            if (parameterGroup == null)
            {
                return NotFound();
            }

            db.ParameterGroups.Remove(parameterGroup);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // GET: odata/ParameterGroups(5)/Group
        [EnableQuery]
        public SingleResult<Group> GetGroup([FromODataUri] int key)
        {
            return SingleResult.Create(db.ParameterGroups.Where(m => m.Id == key).Select(m => m.Group));
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // GET: odata/ParameterGroups(5)/Parameter
        [EnableQuery]
        public SingleResult<Parameter> GetParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.ParameterGroups.Where(m => m.Id == key).Select(m => m.Parameter));
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        private bool ParameterGroupExists(int key)
        {
            return db.ParameterGroups.Count(e => e.Id == key) > 0;
        }
    }
}
