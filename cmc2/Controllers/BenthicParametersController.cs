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
    builder.EntitySet<BenthicParameter>("BenthicParameters");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class BenthicParametersController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        
        // GET: odata/BenthicParameters
        [EnableQuery]
        public IQueryable<BenthicParameter> GetBenthicParameters()
        {
            return db.BenthicParameters;
        }
        
        // GET: odata/BenthicParameters(5)
        [EnableQuery]
        public SingleResult<BenthicParameter> GetBenthicParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicParameters.Where(benthicParameter => benthicParameter.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/BenthicParameters(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicParameter> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicParameter benthicParameter = db.BenthicParameters.Find(key);
            if (benthicParameter == null)
            {
                return NotFound();
            }

            patch.Put(benthicParameter);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicParameterExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicParameter);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/BenthicParameters
        public IHttpActionResult Post(BenthicParameter benthicParameter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BenthicParameters.Add(benthicParameter);
            db.SaveChanges();

            return Created(benthicParameter);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/BenthicParameters(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicParameter> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicParameter benthicParameter = db.BenthicParameters.Find(key);
            if (benthicParameter == null)
            {
                return NotFound();
            }

            patch.Patch(benthicParameter);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicParameterExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicParameter);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/BenthicParameters(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicParameter benthicParameter = db.BenthicParameters.Find(key);
            if (benthicParameter == null)
            {
                return NotFound();
            }

            db.BenthicParameters.Remove(benthicParameter);
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

        private bool BenthicParameterExists(int key)
        {
            return db.BenthicParameters.Count(e => e.Id == key) > 0;
        }
    }
}
