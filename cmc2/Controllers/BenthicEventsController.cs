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
    builder.EntitySet<BenthicEvent>("BenthicEvents");
    builder.EntitySet<ApplicationUser>("ApplicationUsers"); 
    builder.EntitySet<Group>("Groups"); 
    builder.EntitySet<Station>("Stations"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class BenthicEventsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BenthicEvents
        [EnableQuery]
        public IQueryable<BenthicEvent> GetBenthicEvents()
        {
            return db.BenthicEvents;
        }

        // GET: odata/BenthicEvents(5)
        [EnableQuery]
        public SingleResult<BenthicEvent> GetBenthicEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEvents.Where(benthicEvent => benthicEvent.Id == key));
        }
        
        // PUT: odata/BenthicEvents(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicEvent> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicEvent benthicEvent = db.BenthicEvents.Find(key);
            if (benthicEvent == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(benthicEvent);

            if (check)
            {
                patch.Put(benthicEvent);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BenthicEventExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(benthicEvent);
            }
            else
            {
                return Unauthorized();
            }

            
        }
        
        // POST: odata/BenthicEvents
        public IHttpActionResult Post(BenthicEvent benthicEvent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(benthicEvent);

            if (check)
            {
                db.BenthicEvents.Add(benthicEvent);
                db.SaveChanges();

                return Created(benthicEvent);
            }
            else
            {
                return Unauthorized();
            }

            
        }
        
        // PATCH: odata/BenthicEvents(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicEvent> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicEvent benthicEvent = db.BenthicEvents.Find(key);
            if (benthicEvent == null)
            {
                return NotFound();
            }

            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(benthicEvent);

            if (check)
            {
                patch.Patch(benthicEvent);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BenthicEventExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(benthicEvent);
            }
            else
            {
                return Unauthorized();
            }

            
        }
        
        // DELETE: odata/BenthicEvents(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicEvent benthicEvent = db.BenthicEvents.Find(key);
            if (benthicEvent == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(benthicEvent);

            if (check)
            {
                db.BenthicEvents.Remove(benthicEvent);
                db.SaveChanges();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
           
        }

        // GET: odata/BenthicEvents(5)/CreatedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetCreatedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEvents.Where(m => m.Id == key).Select(m => m.CreatedByUser));
        }

        // GET: odata/BenthicEvents(5)/Group
        [EnableQuery]
        public SingleResult<Group> GetGroup([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEvents.Where(m => m.Id == key).Select(m => m.Group));
        }

        // GET: odata/BenthicEvents(5)/ModifiedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetModifiedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEvents.Where(m => m.Id == key).Select(m => m.ModifiedByUser));
        }

        // GET: odata/BenthicEvents(5)/Station
        [EnableQuery]
        public SingleResult<Station> GetStation([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEvents.Where(m => m.Id == key).Select(m => m.Station));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BenthicEventExists(int key)
        {
            return db.BenthicEvents.Count(e => e.Id == key) > 0;
        }
    }
}
