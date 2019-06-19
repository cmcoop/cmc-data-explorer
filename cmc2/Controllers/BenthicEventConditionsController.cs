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
    builder.EntitySet<BenthicEventCondition>("BenthicEventConditions");
    builder.EntitySet<BenthicCondition>("BenthicConditions"); 
    builder.EntitySet<BenthicEvent>("BenthicEvents"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class BenthicEventConditionsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BenthicEventConditions
        [EnableQuery]
        public IQueryable<BenthicEventCondition> GetBenthicEventConditions()
        {
            return db.BenthicEventConditions;
        }

        // GET: odata/BenthicEventConditions(5)
        [EnableQuery]
        public SingleResult<BenthicEventCondition> GetBenthicEventCondition([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEventConditions.Where(benthicEventCondition => benthicEventCondition.Id == key));
        }
        [Authorize]
        // PUT: odata/BenthicEventConditions(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicEventCondition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicEventCondition benthicEventCondition = db.BenthicEventConditions.Find(key);
            if (benthicEventCondition == null)
            {
                return NotFound();
            }

            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicEventCondition.Id);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                patch.Put(benthicEventCondition);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BenthicEventConditionExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(benthicEventCondition);
            }
            else
            {
                return Unauthorized();
            }


           
        }
        [Authorize]
        // POST: odata/BenthicEventConditions
        public IHttpActionResult Post(BenthicEventCondition benthicEventCondition)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicEventCondition.Id);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                db.BenthicEventConditions.Add(benthicEventCondition);
                db.SaveChanges();

                return Created(benthicEventCondition);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        [Authorize]
        // PATCH: odata/BenthicEventConditions(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicEventCondition> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicEventCondition benthicEventCondition = db.BenthicEventConditions.Find(key);
            if (benthicEventCondition == null)
            {
                return NotFound();
            }

            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicEventCondition.Id);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                patch.Patch(benthicEventCondition);

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BenthicEventConditionExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(benthicEventCondition);
            }
            else
            {
                return Unauthorized();
            }
        }
        [Authorize]
        // DELETE: odata/BenthicEventConditions(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicEventCondition benthicEventCondition = db.BenthicEventConditions.Find(key);
            if (benthicEventCondition == null)
            {
                return NotFound();
            }

            BenthicEvent @BenthicEvent = db.BenthicEvents.Find(benthicEventCondition.Id);
            var check = AuthorizeLogic.VerifyBenthicEventEditPermission(@BenthicEvent);

            if (check)
            {
                db.BenthicEventConditions.Remove(benthicEventCondition);
                db.SaveChanges();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
            
        }

        // GET: odata/BenthicEventConditions(5)/BenthicCondition
        [EnableQuery]
        public SingleResult<BenthicCondition> GetBenthicCondition([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEventConditions.Where(m => m.Id == key).Select(m => m.BenthicCondition));
        }

        // GET: odata/BenthicEventConditions(5)/BenthicEvent
        [EnableQuery]
        public SingleResult<BenthicEvent> GetBenthicEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicEventConditions.Where(m => m.Id == key).Select(m => m.BenthicEvent));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BenthicEventConditionExists(int key)
        {
            return db.BenthicEventConditions.Count(e => e.Id == key) > 0;
        }
    }
}
