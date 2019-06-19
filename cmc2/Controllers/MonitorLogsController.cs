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
    builder.EntitySet<MonitorLog>("MonitorLogs");
    builder.EntitySet<ApplicationUser>("ApplicationUsers"); 
    builder.EntitySet<Event>("Events"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [Authorize]
    public class MonitorLogsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/MonitorLogs
        [EnableQuery]
        public IQueryable<MonitorLog> GetMonitorLogs()
        {
            return db.MonitorLogs;
        }

        // GET: odata/MonitorLogs(5)
        [EnableQuery]
        public SingleResult<MonitorLog> GetMonitorLog([FromODataUri] int key)
        {
            return SingleResult.Create(db.MonitorLogs.Where(monitorLog => monitorLog.Id == key));
        }

        // PUT: odata/MonitorLogs(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<MonitorLog> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MonitorLog monitorLog = db.MonitorLogs.Find(key);
            if (monitorLog == null)
            {
                return NotFound();
            }

            patch.Put(monitorLog);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonitorLogExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(monitorLog);
        }

        // POST: odata/MonitorLogs
        public IHttpActionResult Post(MonitorLog monitorLog)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.MonitorLogs.Add(monitorLog);
            db.SaveChanges();

            return Created(monitorLog);
        }

        // PATCH: odata/MonitorLogs(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<MonitorLog> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MonitorLog monitorLog = db.MonitorLogs.Find(key);
            if (monitorLog == null)
            {
                return NotFound();
            }

            patch.Patch(monitorLog);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonitorLogExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(monitorLog);
        }

        // DELETE: odata/MonitorLogs(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            MonitorLog monitorLog = db.MonitorLogs.Find(key);
            if (monitorLog == null)
            {
                return NotFound();
            }

            db.MonitorLogs.Remove(monitorLog);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/MonitorLogs(5)/ApplicationUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetApplicationUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.MonitorLogs.Where(m => m.Id == key).Select(m => m.ApplicationUser));
        }

        // GET: odata/MonitorLogs(5)/CreatedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetCreatedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.MonitorLogs.Where(m => m.Id == key).Select(m => m.CreatedByUser));
        }

        // GET: odata/MonitorLogs(5)/Event
        [EnableQuery]
        public SingleResult<Event> GetEvent([FromODataUri] int key)
        {
            return SingleResult.Create(db.MonitorLogs.Where(m => m.Id == key).Select(m => m.Event));
        }

        // GET: odata/MonitorLogs(5)/ModifiedByUser
        [EnableQuery]
        public SingleResult<ApplicationUser> GetModifiedByUser([FromODataUri] int key)
        {
            return SingleResult.Create(db.MonitorLogs.Where(m => m.Id == key).Select(m => m.ModifiedByUser));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MonitorLogExists(int key)
        {
            return db.MonitorLogs.Count(e => e.Id == key) > 0;
        }
    }
}
