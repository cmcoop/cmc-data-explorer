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
using cmc2.Helpers;

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<BenthicSample>("BenthicSamples");
    builder.EntitySet<BenthicEvent>("BenthicEvents"); 
    builder.EntitySet<BenthicParameter>("BenthicParameters"); 
    builder.EntitySet<ApplicationUser>("ApplicationUsers"); 
    builder.EntitySet<QaFlag>("QaFlags"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class BenthicSamplesController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/BenthicSamples
        [EnableQuery(MaxExpansionDepth = 10)]
        public IQueryable<BenthicSample> GetBenthicSamples()
        {
            return db.BenthicSamples;
        }
        [Authorize]
        // GET: odata/BenthicSamples(5)
        [EnableQuery]
        public SingleResult<BenthicSample> GetBenthicSample([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicSamples.Where(benthicSample => benthicSample.Id == key));
        }
        [Authorize]
        // PUT: odata/BenthicSamples(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicSample> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicSample benthicSample = db.BenthicSamples.Find(key);
            if (benthicSample == null)
            {
                return NotFound();
            }
            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicSample.BenthicEventId);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                patch.Put(benthicSample);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BenthicSampleExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(benthicSample);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        // POST: odata/BenthicSamples
        public IHttpActionResult Post(BenthicSample benthicSample)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicSample.BenthicEventId);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                db.BenthicSamples.Add(benthicSample);
                db.SaveChanges();

                return Created(benthicSample);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        // PATCH: odata/BenthicSamples(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicSample> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicSample benthicSample = db.BenthicSamples.Find(key);
            if (benthicSample == null)
            {
                return NotFound();
            }
            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicSample.BenthicEventId);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                patch.Patch(benthicSample);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BenthicSampleExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(benthicSample);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        // DELETE: odata/BenthicSamples(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicSample benthicSample = db.BenthicSamples.Find(key);
            if (benthicSample == null)
            {
                return NotFound();
            }
            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicSample.BenthicEventId);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                db.BenthicSamples.Remove(benthicSample);
                db.SaveChanges();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // GET: odata/BenthicSamples(5)/BenthicEvent
        [EnableQuery]
        public SingleResult<BenthicEvent> GetBenthicEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicSamples.Where(m => m.Id == key).Select(m => m.BenthicEvent));
        }

        // GET: odata/BenthicSamples(5)/BenthicParameter
        [EnableQuery]
        public SingleResult<BenthicParameter> GetBenthicParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicSamples.Where(m => m.Id == key).Select(m => m.BenthicParameter));
        }

        // GET: odata/BenthicSamples(5)/CreatedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetCreatedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicSamples.Where(m => m.Id == key).Select(m => m.CreatedByUser));
        }

        // GET: odata/BenthicSamples(5)/ModifiedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetModifiedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicSamples.Where(m => m.Id == key).Select(m => m.ModifiedByUser));
        }

        // GET: odata/BenthicSamples(5)/QaFlag
        [EnableQuery]
        public SingleResult<QaFlag> GetQaFlag([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicSamples.Where(m => m.Id == key).Select(m => m.QaFlag));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BenthicSampleExists(int key)
        {
            return db.BenthicSamples.Count(e => e.Id == key) > 0;
        }
    }
}
