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
    builder.EntitySet<Sample>("Samples");
    builder.EntitySet<Event>("Events"); 
    builder.EntitySet<Parameter>("Parameters"); 
    config.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
   
    public class PublicSamplesController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();


        // GET: odata/Samples
        [EnableQuery(MaxExpansionDepth = 10)]
        public IQueryable<Sample> GetPublicSamples()
        {
            return db.Samples.Where(sample => sample.QaFlagId.Equals(2));
        }

        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SampleExists(int key)
        {
            return db.Samples.Count(e => e.Id == key) > 0;
        }
    }
}
