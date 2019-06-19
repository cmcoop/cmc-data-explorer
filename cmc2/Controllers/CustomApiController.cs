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

    public class CustomApiController : ODataController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        

        [HttpGet]
        [ODataRoute("GetStationRichness")]
        public IHttpActionResult GetStationRichness()
        {

            var result = db.Database
                    .SqlQuery<stationRichness>("countEventsForStation").ToList();
            return Json(result);
        }

        [HttpGet]
        [ODataRoute("GetBenthicStationRichness")]
        public IHttpActionResult GetBenthicStationRichness()
        {

            var result = db.Database
                    .SqlQuery<stationRichness>("countBenthicEventsForStation").ToList();
            return Json(result);
        }

        // Other controller methods not shown.

        public class stationRichness
        {
            public int StationId { get; set; }
            public string Name { get; set; }
            public string WaterBody { get; set; }
            public string Huc6Name { get; set; }
            public string CityCounty { get; set; }
            public string State { get; set; }
            public int EventCount { get; set; }
            public string GroupNames { get; set; }
        }

        [HttpGet]
        [ODataRoute("GetHomeStats")]
        public IHttpActionResult GetHomeStats()
        {

            var result = db.Database
                    .SqlQuery<homeStats>("GetHomeStats").ToList();
            return Json(result);
        }

        // Other controller methods not shown.

        public class homeStats
        {
            public int NewUsersCount { get; set; }
            public int NewGroupsCount { get; set; }
            public int NewStationsCount { get; set; }
            public int SamplesCount { get; set; }
            public int BenthicSamplesCount { get; set; }
            public int WaterBodyCount { get; set; }
            public int StationCount { get; set; }
            public int MonitorsCount { get; set; }
            public int MonitorHoursSum { get; set; }
            public int GroupsCount { get; set; }
            public int BenthicStationCount { get; set; }
        }
        [Authorize]
        [HttpGet]
        [ODataRoute("GetCedrTracking")]
        public IHttpActionResult GetCedrTracking()
        {

            var result = db.Database
                    .SqlQuery<cedrTracking>("GetCedrTracking").ToList();
            return Json(result);
        }

        // Other controller methods not shown.

        public class cedrTracking
        {
            public string Name { get; set; }
            public DateTime Date { get; set; }
           
        }

        [HttpPost]
        [ODataRoute("GetSamplesDownloadPublic")]
        public IHttpActionResult GetSamplesDownloadPublic(ODataActionParameters parameters)
        {
            string State = (string)parameters["state"];
            
            string CityCounty = (string)parameters["cityCounty"];
            string Huc6 = (string)parameters["huc6"];
            string Huc12 = (string)parameters["huc12"];
            string GroupId = (string)parameters["groupId"];
            string ParameterId = (string)parameters["parameterId"];
            string StationId = (string)parameters["stationId"];
            string StartDate = (string)parameters["startDate"];
            string EndDate = (string)parameters["endDate"];

            var result = DynamicListFromSql(db, "samplesDownloadPublic3", new Dictionary<string, object> {
                { "@strStartDateTime", StartDate },
                { "@strEndDateTime", EndDate  },
                { "@groupIds", GroupId },
                { "@stationIds", StationId },
                { "@parameterIds", ParameterId },
                { "@huc6", Huc6 },
                { "@huc12", Huc12 },
                { "@state", State },
                { "@cityCounty", CityCounty },
            });
            // Retrieve the connection from the object context


            return Json(result);
        }


        [HttpPost]
        [ODataRoute("GetBenthicSamplesDownloadPublic")]
        public IHttpActionResult GetBenthicSamplesDownloadPublic(ODataActionParameters parameters)
        {
            string State = (string)parameters["state"];

            string CityCounty = (string)parameters["cityCounty"];
            string Huc6 = (string)parameters["huc6"];
            string Huc12 = (string)parameters["huc12"];
            string GroupId = (string)parameters["groupId"];
            string ParameterId = (string)parameters["parameterId"];
            string StationId = (string)parameters["stationId"];
            string StartDate = (string)parameters["startDate"];
            string EndDate = (string)parameters["endDate"];

            var result = DynamicListFromSql(db, "samplesDownloadBenthic", new Dictionary<string, object> {
                
                { "@strStartDateTime", StartDate },
                { "@strEndDateTime", EndDate  },
                { "@groupIds", GroupId },
                { "@stationIds", StationId },
                { "@parameterIds", ParameterId },
                { "@huc6", Huc6 },
                { "@huc12", Huc12 },
                { "@state", State },
                { "@cityCounty", CityCounty },
            });
            // Retrieve the connection from the object context


            return Json(result);
        }

        [HttpPost]
        [ODataRoute("GetSamplesDownloadPublicCalibration")]
        public IHttpActionResult GetSamplesDownloadPublicCalibration(ODataActionParameters parameters)
        {
            string State = (string)parameters["state"];

            string CityCounty = (string)parameters["cityCounty"];
            string Huc6 = (string)parameters["huc6"];
            string Huc12 = (string)parameters["huc12"];
            string GroupId = (string)parameters["groupId"];
            string ParameterId = (string)parameters["parameterId"];
            string StationId = (string)parameters["stationId"];
            string StartDate = (string)parameters["startDate"];
            string EndDate = (string)parameters["endDate"];

            var result = DynamicListFromSql(db, "samplesDownloadPublicCalibration", new Dictionary<string, object> {
                { "@strStartDateTime", StartDate },
                { "@strEndDateTime", EndDate  },
                { "@groupIds", GroupId },
                { "@stationIds", StationId },
                { "@parameterIds", ParameterId },
                { "@huc6", Huc6 },
                { "@huc12", Huc12 },
                { "@state", State },
                { "@cityCounty", CityCounty },
            });
            // Retrieve the connection from the object context


            return Json(result);
        }

        public static IEnumerable<dynamic> DynamicListFromSql(DbContext db, string Sql, Dictionary<string, object> Params)
        {
            using (var cmd = db.Database.Connection.CreateCommand())
            {
                cmd.CommandText = Sql;
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandTimeout = 0;
                if (cmd.Connection.State != ConnectionState.Open) { cmd.Connection.Open(); }

                foreach (KeyValuePair<string, object> p in Params)
                {

                    if (p.Key == "@strStartDateTime" | p.Key == "@strEndDateTime")
                    {
                        DbParameter dbParameter = cmd.CreateParameter();
                        dbParameter.ParameterName = p.Key;
                        dbParameter.Value = p.Value == null ? (object)DBNull.Value : p.Value;
                        cmd.Parameters.Add(dbParameter);
                    }
                    else
                    {

                        var listTable = new DataTable();
                        listTable.Columns.Add("Name", typeof(string));
                        if (p.Value != null)
                        {
                            string[] words = p.Value.ToString().Split(',');

                            foreach (var word in words)
                            {
                                listTable.Rows.Add(word);
                            }
                        }

                        var listParameter = new SqlParameter();
                        listParameter.ParameterName = p.Key;
                        listParameter.Value = listTable;
                        listParameter.SqlDbType = SqlDbType.Structured;
                        cmd.Parameters.Add(listParameter);
                    }
                }
                using (var dataReader = cmd.ExecuteReader())
                {
                    while (dataReader.Read())
                    {
                        var row = new ExpandoObject() as IDictionary<string, object>;
                        for (var fieldCount = 0; fieldCount < dataReader.FieldCount; fieldCount++)
                        {
                            row.Add(dataReader.GetName(fieldCount), dataReader[fieldCount]);
                        }
                        yield return row;
                    }
                }
            }
        }


        
        [HttpPost]
        [ODataRoute("GetSamplesDownloadPublicStations")]
        public IHttpActionResult GetSamplesDownloadPublicStations(ODataActionParameters parameters)
        {
          string stationIds = (string)parameters["ids"];

            var result = DynamicListFromSql(db, "samplesDownloadPublicStations", new Dictionary<string, object> {
                { "@stationIds", stationIds }
            });
            // Retrieve the connection from the object context


            return Json(result);
        }

        [HttpPost]
        [ODataRoute("GetSamplesDownloadPublicGroups")]
        public IHttpActionResult GetSamplesDownloadPublicGroups(ODataActionParameters parameters)
        {
            string groupIds = (string)parameters["ids"];

            var result = DynamicListFromSql(db, "samplesDownloadPublicGroups", new Dictionary<string, object> {
                { "@groupIds", groupIds }
            });
            // Retrieve the connection from the object context


            return Json(result);
        }

        [HttpPost]
        [ODataRoute("GetSamplesDownloadPublicParameters")]
        public IHttpActionResult GetSamplesDownloadPublicParameters(ODataActionParameters parameters)
        {
            string parameterIds = (string)parameters["ids"];

            var result = DynamicListFromSql(db, "samplesDownloadPublicParameters", new Dictionary<string, object> {
                { "@parameterIds", parameterIds }
            });
            // Retrieve the connection from the object context


            return Json(result);
        }

        [HttpGet]
        [ODataRoute("GetPublishedData")]
        public IHttpActionResult GetPublishedData([FromODataUri] int groupId)
        {

            var result = db.Database
                    .SqlQuery<publishedData>("GetPublishedData @groupId",new SqlParameter("groupId",groupId)).ToList();
            return Json(result);
            
        }
        
        public class publishedData
        {
            public DateTime dateTime { get; set; }
            public string groupName { get; set; }
            public string stationCode { get; set; }
            public string stationName { get; set; }
            public decimal latitude { get; set; }
            public decimal longitude { get; set; }
            public string parameterCode { get; set; }
            public string parameterName { get; set; }
            public decimal? depth { get; set; }
            public decimal? value { get; set; }
            public string problemCode { get; set; }
            public string problemDescription { get; set; }
        }

        [HttpGet]
        [ODataRoute("GetPublishedBenthicData")]
        public IHttpActionResult GetPublishedBenthicData([FromODataUri] int groupId)
        {

            var result = db.Database
                    .SqlQuery<publishedBenthicData>("GetPublishedBenthicData @groupId", new SqlParameter("groupId", groupId)).ToList();
            return Json(result);

        }

        public class publishedBenthicData
        {
            public DateTime dateTime { get; set; }
            public string groupName { get; set; }
            public string stationCode { get; set; }
            public string stationName { get; set; }
            public decimal latitude { get; set; }
            public decimal longitude { get; set; }
            public string parameterCode { get; set; }
            public string parameterName { get; set; }
            public decimal? count { get; set; }
        }
    }



}
