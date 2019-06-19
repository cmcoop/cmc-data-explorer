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
    builder.EntitySet<ConditionCategory>("ConditionCategories");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class ConditionCategoriesController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/ConditionCategories
        [EnableQuery]
        public IQueryable<ConditionCategory> GetConditionCategories()
        {
            return db.ConditionCategories;
        }
        [Authorize]
        // GET: odata/ConditionCategories(5)
        [EnableQuery]
        public SingleResult<ConditionCategory> GetConditionCategory([FromODataUri] int key)
        {
            return SingleResult.Create(db.ConditionCategories.Where(conditionCategory => conditionCategory.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/ConditionCategories(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<ConditionCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ConditionCategory conditionCategory = db.ConditionCategories.Find(key);
            if (conditionCategory == null)
            {
                return NotFound();
            }

            patch.Put(conditionCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConditionCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(conditionCategory);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/ConditionCategories
        public IHttpActionResult Post(ConditionCategory conditionCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ConditionCategories.Add(conditionCategory);
            db.SaveChanges();

            return Created(conditionCategory);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/ConditionCategories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<ConditionCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ConditionCategory conditionCategory = db.ConditionCategories.Find(key);
            if (conditionCategory == null)
            {
                return NotFound();
            }

            patch.Patch(conditionCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConditionCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(conditionCategory);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/ConditionCategories(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            ConditionCategory conditionCategory = db.ConditionCategories.Find(key);
            if (conditionCategory == null)
            {
                return NotFound();
            }

            db.ConditionCategories.Remove(conditionCategory);
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

        private bool ConditionCategoryExists(int key)
        {
            return db.ConditionCategories.Count(e => e.Id == key) > 0;
        }
    }
}
