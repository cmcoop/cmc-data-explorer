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
    builder.EntitySet<QaFlag>("QaFlags");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class QaFlagsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/QaFlags
        [EnableQuery]
        public IQueryable<QaFlag> GetQaFlags()
        {
            return db.QaFlags;
        }
        [Authorize]
        // GET: odata/QaFlags(5)
        [EnableQuery]
        public SingleResult<QaFlag> GetQaFlag([FromODataUri] int key)
        {
            return SingleResult.Create(db.QaFlags.Where(qaFlag => qaFlag.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/QaFlags(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<QaFlag> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            QaFlag qaFlag = db.QaFlags.Find(key);
            if (qaFlag == null)
            {
                return NotFound();
            }

            patch.Put(qaFlag);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QaFlagExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(qaFlag);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/QaFlags
        public IHttpActionResult Post(QaFlag qaFlag)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.QaFlags.Add(qaFlag);
            db.SaveChanges();

            return Created(qaFlag);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/QaFlags(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<QaFlag> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            QaFlag qaFlag = db.QaFlags.Find(key);
            if (qaFlag == null)
            {
                return NotFound();
            }

            patch.Patch(qaFlag);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QaFlagExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(qaFlag);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/QaFlags(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            QaFlag qaFlag = db.QaFlags.Find(key);
            if (qaFlag == null)
            {
                return NotFound();
            }

            db.QaFlags.Remove(qaFlag);
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

        private bool QaFlagExists(int key)
        {
            return db.QaFlags.Count(e => e.Id == key) > 0;
        }
    }
}
