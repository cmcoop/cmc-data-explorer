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

namespace cmc2.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.OData.Builder;
    using System.Web.OData.Extensions;
    using cmc2.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Problem>("Problems");
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    
    public class ProblemsController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        [Authorize]
        // GET: odata/Problems
        [EnableQuery]
        public IQueryable<Problem> GetProblems()
        {
            return db.Problems;
        }
        [Authorize]
        // GET: odata/Problems(5)
        [EnableQuery]
        public SingleResult<Problem> GetProblem([FromODataUri] int key)
        {
            return SingleResult.Create(db.Problems.Where(problem => problem.Id == key));
        }
        [Authorize(Roles = "Admin")]
        // PUT: odata/Problems(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<Problem> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Problem problem = await db.Problems.FindAsync(key);
            if (problem == null)
            {
                return NotFound();
            }

            patch.Put(problem);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProblemExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(problem);
        }
        [Authorize(Roles = "Admin")]
        // POST: odata/Problems
        public async Task<IHttpActionResult> Post(Problem problem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Problems.Add(problem);
            await db.SaveChangesAsync();

            return Created(problem);
        }
        [Authorize(Roles = "Admin")]
        // PATCH: odata/Problems(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Problem> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Problem problem = await db.Problems.FindAsync(key);
            if (problem == null)
            {
                return NotFound();
            }

            patch.Patch(problem);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProblemExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(problem);
        }
        [Authorize(Roles = "Admin")]
        // DELETE: odata/Problems(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Problem problem = await db.Problems.FindAsync(key);
            if (problem == null)
            {
                return NotFound();
            }

            db.Problems.Remove(problem);
            await db.SaveChangesAsync();

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

        private bool ProblemExists(int key)
        {
            return db.Problems.Count(e => e.Id == key) > 0;
        }
    }
}
