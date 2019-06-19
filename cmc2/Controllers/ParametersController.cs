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
    builder.EntitySet<Parameter>("Parameters");
    builder.EntitySet<ParameterGroup>("ParameterGroups"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
   
    public class ParametersController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/Parameters
        [EnableQuery]
        public IQueryable<Parameter> GetParameters()
        {
            return db.Parameters;
        }

        // GET: odata/Parameters(5)
        [EnableQuery]
        public SingleResult<Parameter> GetParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.Parameters.Where(parameter => parameter.Id == key));
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PUT: odata/Parameters(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Parameter> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Parameter parameter = await db.Parameters.FindAsync(key);
            if (parameter == null)
            {
                return NotFound();
            }

            patch.Put(parameter);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParameterExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(parameter);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // POST: odata/Parameters
        public async Task<IHttpActionResult> Post(Parameter parameter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Parameters.Add(parameter);
            await db.SaveChangesAsync();

            return Created(parameter);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PATCH: odata/Parameters(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Parameter> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Parameter parameter = await db.Parameters.FindAsync(key);
            if (parameter == null)
            {
                return NotFound();
            }

            patch.Patch(parameter);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParameterExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(parameter);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // DELETE: odata/Parameters(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Parameter parameter = await db.Parameters.FindAsync(key);
            if (parameter == null)
            {
                return NotFound();
            }

            db.Parameters.Remove(parameter);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // GET: odata/Parameters(5)/ParameterGroups
        [EnableQuery]
        public IQueryable<ParameterGroup> GetParameterGroups([FromODataUri] int key)
        {
            return db.Parameters.Where(m => m.Id == key).SelectMany(m => m.ParameterGroups);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ParameterExists(int key)
        {
            return db.Parameters.Count(e => e.Id == key) > 0;
        }
    }
}
