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
    builder.EntitySet<RelatedParameter>("RelatedParameters");
    builder.EntitySet<Parameter>("Parameters"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class RelatedParametersController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/RelatedParameters
        [EnableQuery]
        public IQueryable<RelatedParameter> GetRelatedParameters()
        {
            return db.RelatedParameters;
        }

        // GET: odata/RelatedParameters(5)
        [EnableQuery]
        public SingleResult<RelatedParameter> GetRelatedParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.RelatedParameters.Where(relatedParameter => relatedParameter.Id == key));
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PUT: odata/RelatedParameters(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<RelatedParameter> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RelatedParameter relatedParameter = db.RelatedParameters.Find(key);
            if (relatedParameter == null)
            {
                return NotFound();
            }

            patch.Put(relatedParameter);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RelatedParameterExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(relatedParameter);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // POST: odata/RelatedParameters
        public IHttpActionResult Post(RelatedParameter relatedParameter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RelatedParameters.Add(relatedParameter);
            db.SaveChanges();

            return Created(relatedParameter);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // PATCH: odata/RelatedParameters(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<RelatedParameter> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RelatedParameter relatedParameter = db.RelatedParameters.Find(key);
            if (relatedParameter == null)
            {
                return NotFound();
            }

            patch.Patch(relatedParameter);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RelatedParameterExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(relatedParameter);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // DELETE: odata/RelatedParameters(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            RelatedParameter relatedParameter = db.RelatedParameters.Find(key);
            if (relatedParameter == null)
            {
                return NotFound();
            }

            db.RelatedParameters.Remove(relatedParameter);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // GET: odata/RelatedParameters(5)/CalibrationParameter
        [EnableQuery]
        public SingleResult<Parameter> GetCalibrationParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.RelatedParameters.Where(m => m.Id == key).Select(m => m.CalibrationParameter));
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // GET: odata/RelatedParameters(5)/WqParameter
        [EnableQuery]
        public SingleResult<Parameter> GetWqParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.RelatedParameters.Where(m => m.Id == key).Select(m => m.WqParameter));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RelatedParameterExists(int key)
        {
            return db.RelatedParameters.Count(e => e.Id == key) > 0;
        }
    }
}
