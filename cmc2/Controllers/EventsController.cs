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
    builder.EntitySet<Event>("Events");
    builder.EntitySet<Group>("Groups"); 
    builder.EntitySet<Station>("Stations"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class EventsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        
        // GET: odata/Events
        [EnableQuery]
        public IQueryable<Event> GetEvents()
        {
            return db.Events;
        }

        // GET: odata/Events(5)
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.Events.Where(@event => @event.Id == key));
        }

        // PUT: odata/Events(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Event> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Event @event = await db.Events.FindAsync(key);
            if (@event == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                patch.Put(@event);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(@event);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // POST: odata/Events
        public async Task<IHttpActionResult> Post(Event @event)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                db.Events.Add(@event);
                await db.SaveChangesAsync();

                return Created(@event);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // PATCH: odata/Events(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Event> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Event @event = await db.Events.FindAsync(key);
            if (@event == null)
            {
                return NotFound();
            }

            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                patch.Patch(@event);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(@event);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // DELETE: odata/Events(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Event @event = await db.Events.FindAsync(key);
            if (@event == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                db.Events.Remove(@event);
                await db.SaveChangesAsync();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
           
        }

        

        // GET: odata/Events(5)/Station
        [EnableQuery]
        public SingleResult<Station> GetStation([FromODataUri] int key)
        {
            return SingleResult.Create(db.Events.Where(m => m.Id == key).Select(m => m.Station));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventExists(int key)
        {
            return db.Events.Count(e => e.Id == key) > 0;
        }
    }
}
