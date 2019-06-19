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
    builder.EntitySet<EventCondition>("EventConditions");
    builder.EntitySet<Condition>("Conditions"); 
    builder.EntitySet<Event>("Events"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class EventConditionsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/EventConditions
        [EnableQuery]
        public IQueryable<EventCondition> GetEventConditions()
        {
            return db.EventConditions;
        }

        // GET: odata/EventConditions(5)
        [EnableQuery]
        public SingleResult<EventCondition> GetEventCondition([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventConditions.Where(eventCondition => eventCondition.Id == key));
        }

        // PUT: odata/EventConditions(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<EventCondition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventCondition eventCondition = db.EventConditions.Find(key);
            if (eventCondition == null)
            {
                return NotFound();
            }
            Event @event = db.Events.Find(eventCondition.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                patch.Put(eventCondition);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventConditionExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(eventCondition);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // POST: odata/EventConditions
        public IHttpActionResult Post(EventCondition eventCondition)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Event @event = db.Events.Find(eventCondition.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                db.EventConditions.Add(eventCondition);
                db.SaveChanges();

                return Created(eventCondition);
            }
            else
            {
                return Unauthorized();
            }
           
        }

        // PATCH: odata/EventConditions(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<EventCondition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EventCondition eventCondition = db.EventConditions.Find(key);
            if (eventCondition == null)
            {
                return NotFound();
            }
            Event @event = db.Events.Find(eventCondition.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                patch.Patch(eventCondition);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventConditionExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(eventCondition);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // DELETE: odata/EventConditions(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            EventCondition eventCondition = db.EventConditions.Find(key);
            if (eventCondition == null)
            {
                return NotFound();
            }

            Event @event = db.Events.Find(eventCondition.EventId);
            var check = AuthorizeLogic.VerifyEventEditPermission(@event);

            if (check)
            {
                db.EventConditions.Remove(eventCondition);
                db.SaveChanges();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
           
        }

        // GET: odata/EventConditions(5)/Condition
        [EnableQuery]
        public SingleResult<Condition> GetCondition([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventConditions.Where(m => m.Id == key).Select(m => m.Condition));
        }

        // GET: odata/EventConditions(5)/Event
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.EventConditions.Where(m => m.Id == key).Select(m => m.Event));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventConditionExists(int key)
        {
            return db.EventConditions.Count(e => e.Id == key) > 0;
        }
    }
}
