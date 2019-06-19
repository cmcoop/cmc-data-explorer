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
    builder.EntitySet<Condition>("Conditions");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class ConditionsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/Conditions
        [EnableQuery]
        public IQueryable<Condition> GetConditions()
        {
            return db.Conditions;
        }
        [Authorize]
        // GET: odata/Conditions(5)
        [EnableQuery]
        public SingleResult<Condition> GetCondition([FromODataUri] int key)
        {
            return SingleResult.Create(db.Conditions.Where(condition => condition.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/Conditions(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<Condition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Condition condition = db.Conditions.Find(key);
            if (condition == null)
            {
                return NotFound();
            }

            patch.Put(condition);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConditionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(condition);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/Conditions
        public IHttpActionResult Post(Condition condition)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Conditions.Add(condition);
            db.SaveChanges();

            return Created(condition);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/Conditions(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<Condition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Condition condition = db.Conditions.Find(key);
            if (condition == null)
            {
                return NotFound();
            }

            patch.Patch(condition);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConditionExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(condition);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/Conditions(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Condition condition = db.Conditions.Find(key);
            if (condition == null)
            {
                return NotFound();
            }

            db.Conditions.Remove(condition);
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

        private bool ConditionExists(int key)
        {
            return db.Conditions.Count(e => e.Id == key) > 0;
        }
    }
}
