using System.Web;
using System.Web.Optimization;

namespace cmc2
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/appPackages").Include(
            //     "~/Scripts/allPackages.js"
            //));


            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //"~/Scripts/bootstrap.js",
            //          "~/Scripts/respond.js"
            //         ));

            bundles.Add(new Bundle("~/Scripts/allJsLibrariesBundle").Include(
                "~/Scripts/allJsLibraries.js", "~/Scripts/reportBug.js"));

            bundles.Add(new Bundle("~/Scripts/angularModule").Include(
                "~/ang/admin/app.js"));

            bundles.Add(new Bundle("~/Scripts/angularPublicModule").Include(
               "~/ang/public/app.js"));

            bundles.Add(new Bundle("~/Scripts/angularUsersModule").Include(
              "~/ang/users/app.js"));

            bundles.Add(new ScriptBundle("~/Scripts/allAngularUsersCustom")
               .Include(                
                "~/ang/users/controllers/indexController.js"
            ));



            bundles.Add(new ScriptBundle("~/Scripts/allAngularPublicCustom")
               .Include(
                "~/ang/public/services/parameterService.js",
                "~/ang/public/services/benthicParameterService.js",
                "~/ang/public/services/stationService.js",
                "~/ang/public/services/sampleService.js",
                "~/ang/public/services/benthicSampleService.js",
                "~/ang/public/services/groupService.js",
                 "~/ang/public/services/stationGroupService.js",
                 "~/ang/public/services/relatedParameterService.js",
                  "~/ang/public/services/parameterGroupService.js",
                "~/ang/public/controllers/indexController.js",
                "~/ang/public/controllers/homeController.js",
                "~/ang/public/controllers/queryController.js",
                "~/ang/admin/helpers/providers.js"

           ));

            bundles.Add(new ScriptBundle("~/Scripts/allAngularCustom")
                .Include(
                "~/ang/admin/services/benthicEventService.js",
                "~/ang/admin/services/benthicParameterService.js",
                "~/ang/admin/services/benthicSampleService.js",
                "~/ang/admin/services/benthicConditionService.js",
                "~/ang/admin/services/benthicConditionCategoriesService.js",
                "~/ang/admin/services/benthicEventConditionService.js",
                "~/ang/admin/services/benthicMonitorLogService.js",
                "~/ang/admin/services/groupService.js",
                "~/ang/admin/services/eventService.js",
                "~/ang/admin/services/sampleService.js",
                "~/ang/admin/services/parameterService.js",
                "~/ang/admin/services/relatedParameterService.js",
                "~/ang/admin/services/parameterGroupService.js",
                "~/ang/admin/services/stationGroupService.js",
                "~/ang/admin/services/stationService.js",
                "~/ang/admin/services/problemService.js",
                "~/ang/admin/services/qualifierService.js",
                "~/ang/admin/services/stationSamplingMethodService.js",
                "~/ang/admin/services/qaFlagService.js",
                "~/ang/admin/services/monitorLogService.js",
                "~/ang/admin/services/conditionService.js",
                "~/ang/admin/services/conditionCategoriesService.js",
                "~/ang/admin/services/eventConditionService.js",
                "~/ang/admin/services/labService.js",
                "~/ang/admin/services/userService.js",
                "~/ang/admin/helpers/providers.js",
                "~/ang/admin/controllers/indexController.js",
                "~/ang/admin/controllers/downloadToolController.js",
                "~/ang/admin/controllers/samplesUploadTypeController.js",
                "~/ang/admin/controllers/samplesAddBulkController.js",
                "~/ang/admin/controllers/samplesEditController.js",
                "~/ang/admin/controllers/samplesEditReviewController.js",
                "~/ang/admin/controllers/samplesAddController.js",
                "~/ang/admin/controllers/stationsSubmitController.js",
                "~/ang/admin/controllers/stationsAddBulkController.js",
                "~/ang/admin/controllers/stationsController.js",
                "~/ang/admin/controllers/stationsAddController.js",                
                "~/ang/admin/controllers/conditionsController.js",
                "~/ang/admin/controllers/labsController.js",
                "~/ang/admin/controllers/parametersController.js",
                "~/ang/admin/controllers/calibrationParametersController.js",
                "~/ang/admin/controllers/groupsController.js",
                "~/ang/admin/controllers/usersAddBulkController.js",
                "~/ang/admin/controllers/benthicSamplesEditController.js",
                "~/ang/admin/controllers/benthicSamplesEditControllerOld.js",
                "~/ang/admin/controllers/benthicSamplesUploadTypeController.js",
                "~/ang/admin/controllers/benthicSamplesAddBulkController.js",
                "~/ang/admin/controllers/benthicSamplesAddController.js",
                "~/ang/admin/controllers/submissionsController.js", 
                "~/ang/admin/controllers/testApiController.js"

            ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      
                      "~/Content/allStyles.css",
                      "~/Content/site/Site.css"


                      ));           

        }
    }
}
