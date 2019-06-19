using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    builder.EntitySet<Lab>("Labs");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
   
    public class LabsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/Labs
        [EnableQuery]
        public IQueryable<Lab> GetLabs()
        {
            return db.Labs;
        }
        [Authorize]
        // GET: odata/Labs(5)
        [EnableQuery]
        public SingleResult<Lab> GetLab([FromODataUri] int key)
        {
            return SingleResult.Create(db.Labs.Where(lab => lab.Id == key));
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PUT: odata/Labs(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Lab> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Lab lab = db.Labs.Find(key);
            if (lab == null)
            {
                return NotFound();
            }

            patch.Put(lab);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LabExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(lab);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // POST: odata/Labs
        public IHttpActionResult Post(Lab lab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Labs.Add(lab);
            db.SaveChanges();

            return Created(lab);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PATCH: odata/Labs(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Lab> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Lab lab = db.Labs.Find(key);
            if (lab == null)
            {
                return NotFound();
            }

            patch.Patch(lab);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LabExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(lab);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // DELETE: odata/Labs(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Lab lab = db.Labs.Find(key);
            if (lab == null)
            {
                return NotFound();
            }

            db.Labs.Remove(lab);
            db.SaveChanges();

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

        private bool LabExists(int key)
        {
            return db.Labs.Count(e => e.Id == key) > 0;
        }
    }
}
