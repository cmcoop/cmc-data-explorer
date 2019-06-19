
using cmc2.Models;
using Microsoft.OData.Edm;
using System;
using System.Linq;
using System.Web.Http;
using System.Web.OData.Batch;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;

namespace cmc2
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            
            config.MapODataServiceRoute("odata", "odata", GetEdmModel(), 
                new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));


            config.SetTimeZoneInfo(TimeZoneInfo.Utc);
            // Web API routes
            //config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.
                FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);
            

        }
        private static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.Namespace = "Demos";
            builder.EntitySet<Group>("Groups");
            builder.EntitySet<ParameterGroup>("ParameterGroups");
            builder.EntitySet<StationGroup>("StationGroups");
            builder.EntitySet<BenthicEvent>("BenthicEvents");
            builder.EntitySet<BenthicSample>("PublicBenthicSamples");
            builder.EntitySet<BenthicSample>("BenthicSamples");
            builder.EntitySet<BenthicParameter>("BenthicParameters");
            builder.EntitySet<BenthicCondition>("BenthicConditions");
            builder.EntitySet<BenthicConditionCategory>("BenthicConditionCategories");
            builder.EntitySet<BenthicEventCondition>("BenthicEventConditions");
            builder.EntitySet<BenthicMonitorLog>("BenthicMonitorLogs");
            builder.EntitySet<Parameter>("Parameters");
            builder.EntitySet<RelatedParameter>("RelatedParameters");
            builder.EntitySet<Station>("Stations");
            builder.EntitySet<Event>("Events");
            builder.EntitySet<Sample>("Samples");
            builder.EntitySet<Sample>("PublicSamples");
            builder.EntitySet<Problem>("Problems");
            builder.EntitySet<Qualifier>("Qualifiers");
            builder.EntitySet<QaFlag>("QaFlags");
            builder.EntitySet<StationSamplingMethod>("StationSamplingMethods");
            builder.EntitySet<Lab>("Labs");
            builder.EntitySet<Condition>("Conditions");
            builder.EntitySet<ConditionCategory>("ConditionCategories");
            builder.EntitySet<EventCondition>("EventConditions");
            builder.EntitySet<UserViewModel>("ApplicationUsers");
            builder.EntitySet<MonitorLog>("MonitorLogs");

            builder.EntitySet<ApplicationUser>("Users").EntityType.Ignore(a => a.PasswordHash);
            builder.EntitySet<ApplicationUser>("Users").EntityType.Ignore(a => a.SecurityStamp);
            builder.EntitySet<ApplicationUser>("Users").EntityType.Ignore(a => a.ProfileImage);

            // New code:
            builder.Function("GetStationRichness")
                .Returns<double>();
            builder.Function("GetBenthicStationRichness")
                .Returns<double>();
            builder.Function("GetHomeStats")
               .Returns<double>();
            builder.Function("GetCedrTracking")
                .Returns<double>();

            var function = builder.Action("GetSamplesDownloadPublic");
            function.Parameter<string>("state");
            function.Parameter<string>("cityCounty");
            function.Parameter<string>("huc6");
            function.Parameter<string>("huc12");
            function.Parameter<string>("groupId");
            function.Parameter<string>("parameterId");
            function.Parameter<string>("stationId");
            function.Parameter<string>("startDate");
            function.Parameter<string>("endDate");
            function.Returns<double>();

            var getBenthicSamplesDownload = builder.Action("GetBenthicSamplesDownloadPublic");
            getBenthicSamplesDownload.Parameter<string>("state");
            getBenthicSamplesDownload.Parameter<string>("cityCounty");
            getBenthicSamplesDownload.Parameter<string>("huc6");
            getBenthicSamplesDownload.Parameter<string>("huc12");
            getBenthicSamplesDownload.Parameter<string>("groupId");
            getBenthicSamplesDownload.Parameter<string>("parameterId");
            getBenthicSamplesDownload.Parameter<string>("stationId");
            getBenthicSamplesDownload.Parameter<string>("startDate");
            getBenthicSamplesDownload.Parameter<string>("endDate");
            getBenthicSamplesDownload.Returns<double>();

            var getSamplesDownloadCalibration = builder.Action("GetSamplesDownloadPublicCalibration");
            getSamplesDownloadCalibration.Parameter<string>("state");
            getSamplesDownloadCalibration.Parameter<string>("cityCounty");
            getSamplesDownloadCalibration.Parameter<string>("huc6");
            getSamplesDownloadCalibration.Parameter<string>("huc12");
            getSamplesDownloadCalibration.Parameter<string>("groupId");
            getSamplesDownloadCalibration.Parameter<string>("parameterId");
            getSamplesDownloadCalibration.Parameter<string>("stationId");
            getSamplesDownloadCalibration.Parameter<string>("startDate");
            getSamplesDownloadCalibration.Parameter<string>("endDate");
            getSamplesDownloadCalibration.Returns<double>();

            var getSamplesDownloadStations = builder.Action("GetSamplesDownloadPublicStations");
            getSamplesDownloadStations.Parameter<string>("ids");
            getSamplesDownloadStations.Returns<double>();

            var getSamplesDownloadGroups = builder.Action("GetSamplesDownloadPublicGroups");
            getSamplesDownloadGroups.Parameter<string>("ids");
            getSamplesDownloadGroups.Returns<double>();

            var getSamplesDownloadParameters = builder.Action("GetSamplesDownloadPublicParameters");
            getSamplesDownloadParameters.Parameter<string>("ids");
            getSamplesDownloadParameters.Returns<double>();

            var getPublishedData = builder.Action("GetPublishedData");
            getPublishedData.Parameter<int>("groupId");
            getPublishedData.Returns<double>();

            var getPublishedBenthicData = builder.Action("GetPublishedBenthicData");
            getPublishedBenthicData.Parameter<int>("groupId");
            getPublishedBenthicData.Returns<double>();

            var edmModel = builder.GetEdmModel();
            return edmModel;
        }
    }
}
