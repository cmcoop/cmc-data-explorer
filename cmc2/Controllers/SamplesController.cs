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
using cmc2.Helpers;

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Sample>("Samples");
    builder.EntitySet<Event>("Events"); 
    builder.EntitySet<Parameter>("Parameters"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class SamplesController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();


        // GET: odata/Samples
        [EnableQuery(MaxExpansionDepth = 10)]
        public IQueryable<Sample> GetSamples()
        {
            return db.Samples;
        }
        

        // GET: odata/Samples(5)
        [EnableQuery]
        public SingleResult<Sample> GetSample([FromODataUri] int key)
        {
            return SingleResult.Create(db.Samples.Where(sample => sample.Id == key));
        }


        // PUT: odata/Samples(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Sample> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Sample sample = await db.Samples.FindAsync(key);
            if (sample == null)
            {
                return NotFound();
            }
            Event @event = db.Events.Find(sample.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                patch.Put(sample);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SampleExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(sample);
            }
            else
            {
                return Unauthorized();
            }
           
        }
        
        // POST: odata/Samples
        public async Task<IHttpActionResult> Post(Sample sample)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Event @event = db.Events.Find(sample.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                db.Samples.Add(sample);
                await db.SaveChangesAsync();

                return Created(sample);
            }
            else
            {
                return Unauthorized();
            }
           
        }

        // PATCH: odata/Samples(5)
        
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Sample> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Sample sample = await db.Samples.FindAsync(key);
            if (sample == null)
            {
                return NotFound();
            }
            Event @event = db.Events.Find(sample.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                patch.Patch(sample);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SampleExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(sample);
            }
            else
            {
                return Unauthorized();
            }
           
        }
       
        // DELETE: odata/Samples(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Sample sample = await db.Samples.FindAsync(key);
            if (sample == null)
            {
                return NotFound();
            }
            Event @event = db.Events.Find(sample.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                db.Samples.Remove(sample);
                await db.SaveChangesAsync();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
            
        }
       
        // GET: odata/Samples(5)/Event
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {             
            return SingleResult.Create(db.Samples.Where(m => m.Id == key).Select(m => m.Event));
        }
       
        // GET: odata/Samples(5)/Parameter
        [EnableQuery]
        public SingleResult<Parameter> GetParameter([FromODataUri] int key)
        {
            return SingleResult.Create(db.Samples.Where(m => m.Id == key).Select(m => m.Parameter));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SampleExists(int key)
        {
            return db.Samples.Count(e => e.Id == key) > 0;
        }
    }
}
