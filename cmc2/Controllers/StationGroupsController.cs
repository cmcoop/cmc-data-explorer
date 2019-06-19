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
    builder.EntitySet<StationGroup>("StationGroups");
    builder.EntitySet<Group>("Groups"); 
    builder.EntitySet<Station>("Stations"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class StationGroupsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
       
        // GET: odata/StationGroups
        [EnableQuery]
        public IQueryable<StationGroup> GetStationGroups()
        {
            return db.StationGroups;
        }

        // GET: odata/StationGroups(5)
        [EnableQuery]
        public SingleResult<StationGroup> GetStationGroup([FromODataUri] int key)
        {
            return SingleResult.Create(db.StationGroups.Where(stationGroup => stationGroup.Id == key));
        }
        [Authorize]
        // PUT: odata/StationGroups(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<StationGroup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            StationGroup stationGroup = await db.StationGroups.FindAsync(key);
            if (stationGroup == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyStationGroupEditPermission(stationGroup);

            if (check)
            {
                patch.Put(stationGroup);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StationGroupExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(stationGroup);
            }
            else
            {
                return Unauthorized();
            }
           
        }
        [Authorize]
        // POST: odata/StationGroups
        public async Task<IHttpActionResult> Post(StationGroup stationGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var check = AuthorizeLogic.VerifyStationGroupEditPermission(stationGroup);

            if (check)
            {
                db.StationGroups.Add(stationGroup);
                await db.SaveChangesAsync();

                return Created(stationGroup);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        [Authorize]
        // PATCH: odata/StationGroups(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<StationGroup> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            StationGroup stationGroup = await db.StationGroups.FindAsync(key);
            if (stationGroup == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyStationGroupEditPermission(stationGroup);

            if (check)
            {
                patch.Patch(stationGroup);

                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StationGroupExists(key))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Updated(stationGroup);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        [Authorize]
        // DELETE: odata/StationGroups(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            StationGroup stationGroup = await db.StationGroups.FindAsync(key);
            if (stationGroup == null)
            {
                return NotFound();
            }
            var check = AuthorizeLogic.VerifyStationGroupEditPermission(stationGroup);

            if (check)
            {
                db.StationGroups.Remove(stationGroup);
                await db.SaveChangesAsync();

                return StatusCode(HttpStatusCode.NoContent);
            }
            else
            {
                return Unauthorized();
            }
            
        }
        // GET: odata/StationGroups(5)/Group
        [EnableQuery]
        public SingleResult<Group> GetGroup([FromODataUri] int key)
        {
            return SingleResult.Create(db.StationGroups.Where(m => m.Id == key).Select(m => m.Group));
        }
       
        // GET: odata/StationGroups(5)/Station
        [EnableQuery]
        public SingleResult<Station> GetStation([FromODataUri] int key)
        {
            return SingleResult.Create(db.StationGroups.Where(m => m.Id == key).Select(m => m.Station));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StationGroupExists(int key)
        {
            return db.StationGroups.Count(e => e.Id == key) > 0;
        }
    }
}
