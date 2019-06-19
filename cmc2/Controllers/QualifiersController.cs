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
    builder.EntitySet<Qualifier>("Qualifiers");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
   
    public class QualifiersController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/Qualifiers
        [EnableQuery]
        public IQueryable<Qualifier> GetQualifiers()
        {
            return db.Qualifiers;
        }
        [Authorize]
        // GET: odata/Qualifiers(5)
        [EnableQuery]
        public SingleResult<Qualifier> GetQualifier([FromODataUri] int key)
        {
            return SingleResult.Create(db.Qualifiers.Where(qualifier => qualifier.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/Qualifiers(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Qualifier> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Qualifier qualifier = await db.Qualifiers.FindAsync(key);
            if (qualifier == null)
            {
                return NotFound();
            }

            patch.Put(qualifier);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QualifierExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(qualifier);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/Qualifiers
        public async Task<IHttpActionResult> Post(Qualifier qualifier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Qualifiers.Add(qualifier);
            await db.SaveChangesAsync();

            return Created(qualifier);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/Qualifiers(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Qualifier> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Qualifier qualifier = await db.Qualifiers.FindAsync(key);
            if (qualifier == null)
            {
                return NotFound();
            }

            patch.Patch(qualifier);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QualifierExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(qualifier);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/Qualifiers(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Qualifier qualifier = await db.Qualifiers.FindAsync(key);
            if (qualifier == null)
            {
                return NotFound();
            }

            db.Qualifiers.Remove(qualifier);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QualifierExists(int key)
        {
            return db.Qualifiers.Count(e => e.Id == key) > 0;
        }
    }
}
