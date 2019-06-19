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
using Newtonsoft.Json;
using System.Dynamic;
using System.Data.Common;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Station>("Stations");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */

    public class StationsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: odata/Stations
        [EnableQuery]
        public IQueryable<Station> GetStations()
        {
            return db.Stations;
        }

        // GET: odata/Stations(5)
        [EnableQuery]
        public SingleResult<Station> GetStation([FromODataUri] int key)
        {
            return SingleResult.Create(db.Stations.Where(station => station.Id == key));
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        // PUT: odata/Stations(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Station> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Station station = await db.Stations.FindAsync(key);
            if (station == null)
            {
                return NotFound();
            }

            patch.Put(station);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(station);
        }
        [Authorize]
        // POST: odata/Stations
        public async Task<IHttpActionResult> Post(Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Stations.Add(station);
            await db.SaveChangesAsync();

            return Created(station);
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        // PATCH: odata/Stations(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Station> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Station station = await db.Stations.FindAsync(key);
            if (station == null)
            {
                return NotFound();
            }

            patch.Patch(station);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(station);
        }
        [Authorize(Roles = "Admin, Officer, Member")]
        // DELETE: odata/Stations(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Station station = await db.Stations.FindAsync(key);
            if (station == null)
            {
                return NotFound();
            }

            db.Stations.Remove(station);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }
        //[Authorize]
        // GET: odata/Stations(5)/Group
        //[EnableQuery]
        // public SingleResult<Group> GetGroup([FromODataUri] int key)
        // {
        //     return SingleResult.Create(db.Stations.Where(m => m.Id == key).Select(m => m.Group));
        // }
        // GET: odata/Stations(5)/StationGroups
        [Authorize]
        [EnableQuery]
        public IQueryable<StationGroup> GetStationGroups([FromODataUri] int key)
        {
            return db.Stations.Where(m => m.Id == key).SelectMany(m => m.StationGroups);
        }
        [Authorize]
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        [Authorize]
        private bool StationExists(int key)
        {
            return db.Stations.Count(e => e.Id == key) > 0;
        }



    }
    
}
