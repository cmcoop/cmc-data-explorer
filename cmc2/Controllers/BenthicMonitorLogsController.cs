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
    builder.EntitySet<BenthicMonitorLog>("BenthicMonitorLogs");
    builder.EntitySet<ApplicationUser>("ApplicationUsers"); 
    builder.EntitySet<BenthicEvent>("BenthicEvents"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class BenthicMonitorLogsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/BenthicMonitorLogs
        [EnableQuery]
        public IQueryable<BenthicMonitorLog> GetBenthicMonitorLogs()
        {
            return db.BenthicMonitorLogs;
        }

        // GET: odata/BenthicMonitorLogs(5)
        [EnableQuery]
        public SingleResult<BenthicMonitorLog> GetBenthicMonitorLog([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicMonitorLogs.Where(benthicMonitorLog => benthicMonitorLog.Id == key));
        }
        [Authorize]
        // PUT: odata/BenthicMonitorLogs(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<BenthicMonitorLog> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicMonitorLog benthicMonitorLog = db.BenthicMonitorLogs.Find(key);
            if (benthicMonitorLog == null)
            {
                return NotFound();
            }

            patch.Put(benthicMonitorLog);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicMonitorLogExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicMonitorLog);
        }
        [Authorize]
        // POST: odata/BenthicMonitorLogs
        public IHttpActionResult Post(BenthicMonitorLog benthicMonitorLog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.BenthicMonitorLogs.Add(benthicMonitorLog);
            db.SaveChanges();

            return Created(benthicMonitorLog);
        }
        [Authorize]
        // PATCH: odata/BenthicMonitorLogs(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<BenthicMonitorLog> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            BenthicMonitorLog benthicMonitorLog = db.BenthicMonitorLogs.Find(key);
            if (benthicMonitorLog == null)
            {
                return NotFound();
            }

            patch.Patch(benthicMonitorLog);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BenthicMonitorLogExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(benthicMonitorLog);
        }
        [Authorize]
        // DELETE: odata/BenthicMonitorLogs(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            BenthicMonitorLog benthicMonitorLog = db.BenthicMonitorLogs.Find(key);
            if (benthicMonitorLog == null)
            {
                return NotFound();
            }

            db.BenthicMonitorLogs.Remove(benthicMonitorLog);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/BenthicMonitorLogs(5)/ApplicationUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetApplicationUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicMonitorLogs.Where(m => m.Id == key).Select(m => m.ApplicationUser));
        }

        // GET: odata/BenthicMonitorLogs(5)/BenthicEvent
        [EnableQuery]
        public SingleResult<BenthicEvent> GetBenthicEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicMonitorLogs.Where(m => m.Id == key).Select(m => m.BenthicEvent));
        }

        // GET: odata/BenthicMonitorLogs(5)/CreatedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetCreatedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicMonitorLogs.Where(m => m.Id == key).Select(m => m.CreatedByUser));
        }

        // GET: odata/BenthicMonitorLogs(5)/ModifiedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetModifiedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.BenthicMonitorLogs.Where(m => m.Id == key).Select(m => m.ModifiedByUser));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BenthicMonitorLogExists(int key)
        {
            return db.BenthicMonitorLogs.Count(e => e.Id == key) > 0;
        }
    }
}
