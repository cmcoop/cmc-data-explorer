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
    builder.EntitySet<BenthicCondition>("BenthicConditions");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class BenthicConditionsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BenthicConditions
        [EnableQuery]
        public IQueryable<BenthicCondition> GetBenthicConditions()
        {
            return db.BenthicConditions;
        }

        // GET: odata/BenthicConditions(5)
        [EnableQuery]
        public SingleResult<BenthicCondition> GetBenthicCondition([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicConditions.Where(benthicCondition => benthicCondition.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/BenthicConditions(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicCondition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicCondition benthicCondition = db.BenthicConditions.Find(key);
            if (benthicCondition == null)
            {
                return NotFound();
            }

            patch.Put(benthicCondition);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicConditionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicCondition);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/BenthicConditions
        public IHttpActionResult Post(BenthicCondition benthicCondition)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BenthicConditions.Add(benthicCondition);
            db.SaveChanges();

            return Created(benthicCondition);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/BenthicConditions(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicCondition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicCondition benthicCondition = db.BenthicConditions.Find(key);
            if (benthicCondition == null)
            {
                return NotFound();
            }

            patch.Patch(benthicCondition);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicConditionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicCondition);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/BenthicConditions(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicCondition benthicCondition = db.BenthicConditions.Find(key);
            if (benthicCondition == null)
            {
                return NotFound();
            }

            db.BenthicConditions.Remove(benthicCondition);
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

        private bool BenthicConditionExists(int key)
        {
            return db.BenthicConditions.Count(e => e.Id == key) > 0;
        }
    }
}
