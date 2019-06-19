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
    builder.EntitySet<BenthicConditionCategory>("BenthicConditionCategories");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class BenthicConditionCategoriesController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BenthicConditionCategories
        [EnableQuery]
        public IQueryable<BenthicConditionCategory> GetBenthicConditionCategories()
        {
            return db.BenthicConditionCategories;
        }

        // GET: odata/BenthicConditionCategories(5)
        [EnableQuery]
        public SingleResult<BenthicConditionCategory> GetBenthicConditionCategory([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicConditionCategories.Where(benthicConditionCategory => benthicConditionCategory.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/BenthicConditionCategories(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicConditionCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicConditionCategory benthicConditionCategory = db.BenthicConditionCategories.Find(key);
            if (benthicConditionCategory == null)
            {
                return NotFound();
            }

            patch.Put(benthicConditionCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicConditionCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicConditionCategory);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/BenthicConditionCategories
        public IHttpActionResult Post(BenthicConditionCategory benthicConditionCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BenthicConditionCategories.Add(benthicConditionCategory);
            db.SaveChanges();

            return Created(benthicConditionCategory);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/BenthicConditionCategories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicConditionCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicConditionCategory benthicConditionCategory = db.BenthicConditionCategories.Find(key);
            if (benthicConditionCategory == null)
            {
                return NotFound();
            }

            patch.Patch(benthicConditionCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicConditionCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicConditionCategory);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/BenthicConditionCategories(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicConditionCategory benthicConditionCategory = db.BenthicConditionCategories.Find(key);
            if (benthicConditionCategory == null)
            {
                return NotFound();
            }

            db.BenthicConditionCategories.Remove(benthicConditionCategory);
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

        private bool BenthicConditionCategoryExists(int key)
        {
            return db.BenthicConditionCategories.Count(e => e.Id == key) > 0;
        }
    }
}
