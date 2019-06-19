using cmc2.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using cmc2.Helpers;
using System.IO;
using System.Text.RegularExpressions;
using System.Globalization;
using Excel;
using System.Data;
using System.Runtime.Serialization.Json;
using Newtonsoft.Json;
using Microsoft.VisualBasic.FileIO;


namespace cmc2.Controllers
{
    public class AdminController : Controller
    {
        public class BayProgramData
        {

        }

        public class RootObject
        {
            public string status { get; set; }
            public string about { get; set; }
            public List<BayProgramData> results { get; set; }
        }
        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        [Authorize]
        // GET: Admin
        public async Task<ActionResult> Index()
        {
            if (!Request.Path.EndsWith("/"))
            {
                return RedirectPermanent(Request.Url.ToString() + "/");
            }
            
            var id = HttpContext.User.Identity.GetUserId();
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);
            var userRoles = await UserManager.GetRolesAsync(user.Id);
            var context = new ApplicationDbContext();

            ViewBag.Name = user.FirstName;
            ViewBag.UserId = user.Id;
            ViewBag.Role = userRoles.First();
            ViewBag.Group = context.Groups.Where(g => g.Id.Equals(user.GroupId)).Select(n => n.Name).FirstOrDefault();
            ViewBag.GroupId = user.GroupId;

            return View();
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        #region BethnicSamples
        [HttpPost]
        public ActionResult BenthicSamplesBulk(FormCollection form, HttpPostedFileBase file)
        {
            if (!(file != null && file.ContentLength > 0))
            {
                return Json(false);
            }
            var errors = new List<object>();
            ApplicationDbContext dbContext = new ApplicationDbContext();

            if (file.FileName.ToLower().EndsWith(".csv"))
            {
                return ExtractBenthicSamplesCsv(file, dbContext);
            }
            else
            {
                errors.Add(new
                {
                    key = "Filename",
                    value = string.Format("Please check the file type. Only .csv files are accepted."
                               )
                });
                return Json(new { errors = errors, status = 409, success = false });
            }
            /*else if (file.FileName.ToLower().EndsWith(".xlsx"))
            {
                return ExtractBenthicSamplesXlsx(file, dbContext);
            }*/
            
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private ActionResult ExtractBenthicSamplesCsv(HttpPostedFileBase file, ApplicationDbContext dbContext)
        {
            var memoryStream = new MemoryStream(file.ContentLength);

            file.InputStream.CopyTo(memoryStream);
            memoryStream.Position = 0;


            var content = string.Empty;
            using (StreamReader reader = new StreamReader(memoryStream))
            {
                content = reader.ReadToEnd();
                reader.Close();

            }

            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\n+", string.Empty);
            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\r+", string.Empty);

            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");

                    string[] headers = parser.Split(line);

                    var errors = new List<object>();
                    var eventReqs = new DataTable();
                    eventReqs.Columns.Add("key", typeof(string));
                    eventReqs.Columns.Add("value", typeof(bool));
                    eventReqs.Columns.Add("description", typeof(string));
                    int count = 1;

                    while ((line = reader.ReadLine()) != null)
                    {
                        count++;

                        //Separating columns to array
                        TextFieldParser lineParser = new TextFieldParser(new StringReader(line));

                        // You can also read from a file
                        // TextFieldParser parser = new TextFieldParser("mycsvfile.csv");

                        lineParser.HasFieldsEnclosedInQuotes = true;
                        lineParser.SetDelimiters(",");
                        
                        string[] fields = null;
                        try
                        {
                            fields = lineParser.ReadFields();
                        }
                        catch (MalformedLineException ex)
                        {
                            errors.Add(new
                            {
                                key = "Row" + count,
                                value = string.Format("The row at line {0} is invalid.  Please check the data file submitted.  " +
                                "This row could not be parsed. Please double check the format of this row. "
                                , count)
                            });
                        }




                        lineParser.Close();



                        if (fields != null)
                        {

                            if (fields.Count() > 8)
                            {
                                errors.Add(new
                                {
                                    key = "Row" + count,
                                    value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 8 columns, but this row has more than 8." +
                                    "This can often happen if commas have been included in a field. If this is the case, either remove the commas or surround the field in double quotes. Also check that there are 8 columns.", count)
                                });
                            }

                            if (fields.Count() < 8)
                            {
                                errors.Add(new
                                {
                                    key = "Row" + count,
                                    value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 8 columns, but this row has less than 8." +
                                    "This can often happen if new line or return characters have been included in a field. If this is the case, either remove the return or new line characters from the fields. Also check that there are 8 columns", count)
                                });
                            }
                            else
                            {
                                if (errors.Count < 200) //stop adding errors
                                {
                                    var errs = BenthicSamplesParseLine(true, dbContext, count, fields, eventReqs);
                                    if (errs != null)
                                    {
                                        errors.AddRange(errs);
                                    }
                                }
                                else if (errors.Count == 200)
                                {
                                    errors.Add(new { key = "Row" + count, value = string.Format("You have reached the maximum 200 errors. There may be more errors associated with this file.", count) });
                                }
                            }
                        }
                    }

                    foreach (DataRow row in eventReqs.Rows)
                    {
                        if (!(bool)row["value"])
                        {
                            errors.Add(new { key = "Row" + count, value = "The Sampling Event for " + row["description"] + " is missing a bottom type condition. This is required for all groups that follow Issac Walton League's benthic methodology." }) ;
                        }
                    }

                    if (errors.Count > 0)
                    {
                        return Json(new { errors = errors, status = 409, success = false });
                    }
                }
            }

            //memoryStream = new MemoryStream(file.ContentLength);

            //file.InputStream.Position = 0;

            //file.InputStream.CopyTo(memoryStream);

            //memoryStream.Position = 0;



            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");

                    string[] headers = parser.Split(line);

                    while ((line = reader.ReadLine()) != null)
                    {
                        //Separating columns to array
                        TextFieldParser lineParser = new TextFieldParser(new StringReader(line));
                        lineParser.HasFieldsEnclosedInQuotes = true;
                        lineParser.SetDelimiters(",");


                        string[] fields = null;
                        try
                        {
                            fields = lineParser.ReadFields();
                        }
                        catch (MalformedLineException ex)
                        {
                            
                        }




                        lineParser.Close();



                        if (fields != null)
                        {



                            BenthicSamplesParseLine(false, dbContext, 1, fields, null);
                        }
                    }
                }
            }

            return Json(new { status = 201, success = true });
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private ActionResult ExtractBenthicSamplesXlsx(HttpPostedFileBase file, ApplicationDbContext dbContext)
        {
            var memoryStream = new MemoryStream(file.ContentLength);

            file.InputStream.CopyTo(memoryStream);

            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(fileStream))
                {
                    excelReader.IsFirstRowAsColumnNames = true;

                    var errors = new List<object>();
                    var eventReqs = new DataTable();
                    eventReqs.Columns.Add("key", typeof(string));
                    eventReqs.Columns.Add("value", typeof(bool));
                    eventReqs.Columns.Add("description", typeof(string));
                    int count = 1;

                    excelReader.Read();

                    while (excelReader.Read())
                    {
                        if (excelReader.FieldCount < 11)
                        {
                            errors.Add(new { key = "Row" + count, value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 11 columns, but this row has less than 11.", count) });
                        }
                        if (excelReader.FieldCount > 11)
                        {
                            errors.Add(new { key = "Row" + count, value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 11 columns, but this row has more than 11.", count) });
                        }
                        else
                        {
                            List<string> fields = new List<string>();

                            fields.Add((excelReader.GetString(0) != null) ? excelReader.GetString(0) : "");
                            fields.Add((excelReader.GetString(1) != null) ? excelReader.GetString(1) : "");
                            fields.Add((excelReader.GetString(2) != null) ? excelReader.GetString(2) : "");
                            fields.Add((excelReader.GetString(3) != null) ? excelReader.GetString(3) : "");
                            fields.Add((excelReader.GetString(4) != null) ? excelReader.GetString(4) : "");
                            fields.Add((excelReader.GetString(5) != null) ? excelReader.GetString(5) : "");
                            fields.Add((excelReader.GetString(6) != null) ? excelReader.GetString(6) : "");
                            fields.Add((excelReader.GetString(7) != null) ? excelReader.GetString(7) : "");
                            fields.Add((excelReader.GetString(8) != null) ? excelReader.GetString(8) : "");
                            fields.Add((excelReader.GetString(9) != null) ? excelReader.GetString(9) : "");
                            fields.Add((excelReader.GetString(10) != null) ? excelReader.GetString(10) : "");

                            var errs = BenthicSamplesParseLine(true, dbContext, count, fields.ToArray(), eventReqs);

                            if (errs != null)
                            {
                                errors.AddRange(errs);
                            }
                        }

                        count++;
                    }

                    foreach (DataRow row in eventReqs.Rows)
                    {
                        if (!(bool)row["value"])
                        {
                            errors.Add(new { key = "Row" + count, value = "The Sampling Event for " + row["description"] + " is missing a bottom type condition. This is required for all groups that follow Issac Walton League's benthic methodology." });
                        }
                    }

                    if (errors.Count > 0)
                    {
                        return Json(new { errors = errors, status = 409, success = false });
                    }
                }
            }

            memoryStream = new MemoryStream(file.ContentLength);

            file.InputStream.Position = 0;

            file.InputStream.CopyTo(memoryStream);

            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(fileStream))
                {
                    while (excelReader.Read())
                    {
                        List<string> fields = new List<string>();

                        fields.Add((excelReader.GetString(0) != null) ? excelReader.GetString(0) : "");
                        fields.Add((excelReader.GetString(1) != null) ? excelReader.GetString(1) : "");
                        fields.Add((excelReader.GetString(2) != null) ? excelReader.GetString(2) : "");
                        fields.Add((excelReader.GetString(3) != null) ? excelReader.GetString(3) : "");
                        fields.Add((excelReader.GetString(4) != null) ? excelReader.GetString(4) : "");
                        fields.Add((excelReader.GetString(5) != null) ? excelReader.GetString(5) : "");
                        fields.Add((excelReader.GetString(6) != null) ? excelReader.GetString(6) : "");
                        fields.Add((excelReader.GetString(7) != null) ? excelReader.GetString(7) : "");
                        fields.Add((excelReader.GetString(8) != null) ? excelReader.GetString(8) : "");
                        fields.Add((excelReader.GetString(9) != null) ? excelReader.GetString(9) : "");
                        fields.Add((excelReader.GetString(10) != null) ? excelReader.GetString(10) : "");

                        BenthicSamplesParseLine(true, dbContext, 1, fields.ToArray(), null);
                    }
                }
            }

            return Json(new { status = 201, success = true });
        }

        private List<object> BenthicSamplesParseLine(bool check, ApplicationDbContext dbContext, int count, 
            string[] fields, DataTable eventReqs)
        {
            string groupCode = fields[0];
            string stationCode = fields[1];
            string eventDate = fields[2];
            string eventTime = fields[3];
            string parameterType = fields[4];
            string parameterName = fields[5];
            string value = fields[6];
            string comments = fields[7];

            var errors = new List<object>();

            var group = dbContext.Groups.FirstOrDefault(g => g.Code.Equals(groupCode));

            if (group == null)
            {
                errors.Add(new { key = "Group" + count, value = string.Format("The group code provided in row {0} is invalid.  Please check the data file submitted.", count) });
            }

            var station = dbContext.Stations.FirstOrDefault(s => s.Code.Equals(stationCode));

            if (station == null)
            {
                errors.Add(new { key = "Station" + count, value = string.Format("The station code provided in row {0} is invalid.  Please check the data file submitted.", count) });
            }else if (station.Status == false)
            {
                errors.Add(new { key = "Station" + count, value = string.Format("The station provided in row {0} is invalid because the station has not been activated. Please activate this station under manage stations or check the data file submitted.", count) });
            }

            string pattern = "M/d/yyyy h:mm:ss tt";
            DateTime parsedDate;
            if (!DateTime.TryParseExact(eventDate + " " + eventTime, pattern, null, DateTimeStyles.None, out parsedDate))
            {
                pattern = "M/d/yyyy HH:mm:ss";
                if (!DateTime.TryParseExact(eventDate + " " + eventTime, pattern, null, DateTimeStyles.None, out parsedDate))
                {
                    errors.Add(new { key = "DateTime" + count, value = string.Format("The date/time provided in row {0} is invalid.  The date pattern should be 'm/d/yyyy' and the time pattern should be 'hh:mm:ss' or 'h:mm:ss tt'.  Please check the data file submitted.", count) });
                }
            }
            
            var user = dbContext.Users.FirstOrDefault(u => u.UserName.Equals(this.HttpContext.User.Identity.Name));

            if (group != null && station != null && parsedDate != null)
            {
                var @event = dbContext.BenthicEvents.FirstOrDefault(e =>
                    e.GroupId.Equals(group.Id) &&
                    e.StationId.Equals(station.Id) &&
                    e.DateTime.Equals(parsedDate)
                );

                if (@event == null && !check)
                {
                    @event = new BenthicEvent()
                    {
                        GroupId = group.Id,
                        StationId = station.Id,
                        DateTime = parsedDate,
                        CreatedBy = user.Id,
                        CreatedDate = DateTime.Now,
                        ModifiedBy = user.Id,
                        ModifiedDate = DateTime.Now,
                        Comments = comments
                    };

                    dbContext.BenthicEvents.Add(@event);
                    dbContext.SaveChanges();
                }
                var key = group.Id.ToString() + station.Id.ToString() + parsedDate.ToString();
                var desc = station.Name + " " + parsedDate.ToString();
                if (check && group.BenthicMethod == "iwl")
                {
                    bool exists = false;
                    foreach (DataRow row in eventReqs.Rows)
                    {
                        if (row["key"].ToString() == key)
                        {
                            exists = true;
                        }
                    }
                    if (!exists)
                    {
                        eventReqs.Rows.Add(key, false, desc);
                    }
                }

                if (parameterType.Equals("Tally", StringComparison.InvariantCultureIgnoreCase))
                {
                    var tallyErrors = SaveBenthicTally(check, dbContext, count, parameterName, value, comments, @event);

                    errors.AddRange(tallyErrors);
                }
                else if (parameterType.Equals("Monitor", StringComparison.InvariantCultureIgnoreCase))
                {
                    var monitorLogErrors = SaveBenthicMonitorLog(check, dbContext, count, parameterName, value, @event);

                    errors.AddRange(monitorLogErrors);
                }
                else if (parameterType.Equals("Condition", StringComparison.InvariantCultureIgnoreCase))
                {
                    var eventConditionErrors = SaveBenthicEventCondition(check, dbContext, count, parameterName, value, @event);
                    
                    if (check && group.BenthicMethod == "iwl" && parameterName == "BT")
                    {
                        
                        bool replaced = false;
                        foreach (DataRow row in eventReqs.Rows)
                        {
                            if(row["key"].ToString() == key && !(bool)row["value"])
                            {
                                replaced = true;
                                row["value"] = true;
                            }
                        }
                        if (!replaced)
                        {
                            eventReqs.Rows.Add(key, true, desc);
                        }

                    }

                    errors.AddRange(eventConditionErrors);
                }
                else
                {
                    errors.Add(new { key = "SampleType" + count, value = string.Format("The parameter type provided in row {0} is unknown.  Please check that data provides one of the following values - WaterQuality, Monitor, Condition. Also check for any extra spaces at the end of the string.", count) });
                }
            }
            else
            {
                errors.Add(new { key = "Row" + count, value = string.Format("Unable to create or find the event.  The row at line {0} is invalid.  Please check the data file submitted.", count) });

                return errors;
            }

            return errors;
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SaveBenthicTally(bool check, ApplicationDbContext dbContext, int count,
            string parameterName, string value, string comments, BenthicEvent @event)
        {
            var errors = new List<object>();

            decimal sValue = 0.0M;

            decimal parsedValue;
            if (!Decimal.TryParse(value, out parsedValue))
            {
                errors.Add(new
                {
                    key = "Value" + count,
                    value = string.Format(
                    "The sample value provided in row {0} is invalid." +
                    " The value could not be parsed to a decimal and is not null. " +
                    "Please check the data file submitted.", count)
                });
            }
            else
            {
                sValue = parsedValue;
            }

            var parameter = dbContext.BenthicParameters.FirstOrDefault(p => p.Code.Equals(parameterName));

            if (parameter == null)
            {
                errors.Add(new
                {
                    key = "Parameter" + count,
                    value = string.Format(
                    "The parameter code provided in row {0} does not match a parameter" +
                    " code in the database. ", count)
                });
            }

            if (@event != null)
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The datetime and station provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing event in the database prior to uploading.", count) });
                if (parameter != null)
                {
                    var foundSample = dbContext.Samples.FirstOrDefault(s => s.EventId.Equals(@event.Id));
                    if (foundSample != null)
                    {
                        errors.Add(new { key = "Sample" + count, value = string.Format("The benthic sample provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing sample in the database prior to uploading.", count) });
                    }
                }
            }

            if (!check)
            {
                BenthicSample sample = new BenthicSample()
                {
                    BenthicEventId = @event.Id,
                    BenthicParameterId = parameter.Id,
                    Value = sValue,
                    QaFlagId = 1,
                    Comments = comments,
                    CreatedBy = @event.CreatedBy,
                    CreatedDate = @event.CreatedDate,
                    ModifiedBy = @event.ModifiedBy,
                    ModifiedDate = @event.ModifiedDate
                };

                dbContext.BenthicSamples.Add(sample);
                dbContext.SaveChanges();
            }

            return errors;
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SaveBenthicMonitorLog(bool check, ApplicationDbContext dbContext, int count, string parameterCode, string sampleValue, BenthicEvent @event)
        {
            var errors = new List<object>();

            var user = dbContext.Users.FirstOrDefault(u => u.Code.Equals(parameterCode, StringComparison.InvariantCultureIgnoreCase));

            if (user == null)
            {
                errors.Add(new
                {
                    key = "Monitor" + count,
                    value = string.Format(
                    "The monitor's code value that you provided for the Value column in row {0} is invalid." +
                    " The monitor's code submitted for this row did not match an existing user's code in the database. ", count)
                });
            }

            decimal parsedValue;
            if (!Decimal.TryParse(sampleValue, out parsedValue))
            {
                errors.Add(new { key = "SampleValue" + count, value = string.Format("The sample value provided in row {0} is invalid. Could not convert to a decimal type number. Please check the data file submitted.", count) });
            }

            if (@event != null)
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The datetime and station provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing event in the database prior to uploading.", count) });
               
            }

            if (!check)
            {
                BenthicMonitorLog foundMonitorLog = null;
                if (user != null)
                {
                    foundMonitorLog = dbContext.BenthicMonitorLogs.FirstOrDefault(ml => ml.BenthicEventId.Equals(@event.Id) && ml.UserId.Equals(user.Id));
                }
                else
                {
                    errors.Add(new { key = "User" + count, value = string.Format("The monitor id provided in row {0} is invalid.  Please check the data file submitted.", count) });
                }

                if (foundMonitorLog == null && user != null)
                {

                    BenthicMonitorLog monitorLog = new BenthicMonitorLog()
                    {
                        UserId = user.Id,
                        BenthicEventId = @event.Id,
                        Hours = parsedValue,
                        CreatedBy = @event.CreatedBy,
                        CreatedDate = @event.CreatedDate,
                        ModifiedBy = @event.ModifiedBy,
                        ModifiedDate = @event.ModifiedDate

                    };

                    dbContext.BenthicMonitorLogs.Add(monitorLog);
                    dbContext.SaveChanges();
                }
            }

            return errors;
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SaveBenthicEventCondition(bool check, ApplicationDbContext dbContext, int count, string parameterCode, string sampleValue, BenthicEvent @event)
        {
            var errors = new List<object>();

            var benthicCondition = dbContext.BenthicConditions.FirstOrDefault(c => c.Code.Equals(parameterCode));

            if (benthicCondition == null)
            {
                errors.Add(new
                {
                    key = "Benthic Condition" + count,
                    value = string.Format("The benthic condition code, " + parameterCode +
                    ", provided in row {0} does not match a benthic condition in the database. " +
                    "Please check the data file submitted.  To resolve, revise the code in column 'ParameterName'" +
                    " in this row to match a benthic condition code in the database.", count)
                });
            }
            else
            {
                if (sampleValue == "")
                {
                    errors.Add(new
                    {
                        key = "Benthic Condition" + count,
                        value = string.Format("The benthic condition value provided in row {0} is invalid." +
                        " The value provided for the benthic condition cannot be null. To resolve, " +
                        "either delete this row or add a valid benthic condition category", count)
                    });
                }
                else
                {
                    var benthicConditionCategories = dbContext.BenthicConditionCategories.Where(cc => cc.ConditionId.Equals(benthicCondition.Id));
                    if ((benthicCondition.isCategorical && !benthicConditionCategories.Any(c => c.Category.Equals(sampleValue))))
                    {
                        errors.Add(new { key = "Benthic Condition" + count, value = string.Format("The benthic condition value provided in row {0} is invalid. The value provided for the benthic condition in this row is not a valid category", count) });
                    }
                }
            }

            if (@event != null)
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The datetime and station provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing event in the database prior to uploading.", count) });

            }
            if (!check)
            {
                var foundBenthicEventCondition = dbContext.BenthicEventConditions.FirstOrDefault(ec => ec.BenthicEventId.Equals(@event.Id) && ec.BenthicConditionId.Equals(benthicCondition.Id));

                if (foundBenthicEventCondition == null)
                {

                    BenthicEventCondition benthicEventCondition = new BenthicEventCondition()
                    {
                        BenthicConditionId = benthicCondition.Id,
                        BenthicEventId = @event.Id,
                        Value = sampleValue
                    };

                    dbContext.BenthicEventConditions.Add(benthicEventCondition);
                    dbContext.SaveChanges();
                }
                else
                {
                    errors.Add(new { key = "Benthic Condition" + count, value = string.Format("The benthic condition provided in row {0} is invalid. This benthic condition already exists in the database. Consider deleting the benthic condition prior to upload", count) });
                }
            }
            return errors;
        }
        #endregion BethnicSamples
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        #region SamplesBulk
        [HttpPost]
        public ActionResult SamplesBulk(FormCollection form, HttpPostedFileBase file, bool hasWarning)
        {
            if (!(file != null && file.ContentLength > 0))
            {
                return Json(false);
            }
            var errors = new List<object>();

            ApplicationDbContext dbContext = new ApplicationDbContext();

            if (file.FileName.ToLower().EndsWith(".csv"))
            {
                return ExtractCsv(file, dbContext,hasWarning);
            }
            else
            {
                errors.Add(new
                {
                    key = "Filename",
                    value = string.Format("Please check the file type. Only .csv files are accepted."
                               )
                });
                return Json(new { errors = errors, status = 409, success = false });
            }
            //else if (file.FileName.ToLower().EndsWith(".xlsx"))
            //{
            //    return ExtractXlsx(file, dbContext, hasWarning);
            //}

            
        }
        
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private ActionResult ExtractCsv(HttpPostedFileBase file, ApplicationDbContext dbContext, bool hasWarning)
        {
            var memoryStream = new MemoryStream(file.ContentLength);
            var listOfSamples = new List<string>();

            file.InputStream.CopyTo(memoryStream);
            memoryStream.Position = 0;


            var content = string.Empty;
            using (StreamReader reader = new StreamReader(memoryStream))
            {
                content = reader.ReadToEnd();
                reader.Close();

            }

            
            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\n+", string.Empty);
            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\r+", string.Empty);

            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                

                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");

                    string[] headers = parser.Split(line);

                    var errors = new List<object>();

                    int count = 1;

                    while ((line = reader.ReadLine()) != null)
                    {
                        count++;

                        //Separating columns to array
                        TextFieldParser lineParser = new TextFieldParser(new StringReader(line));

                        // You can also read from a file
                        // TextFieldParser parser = new TextFieldParser("mycsvfile.csv");

                        lineParser.HasFieldsEnclosedInQuotes = true;
                        lineParser.SetDelimiters(",");


                        string[] fields = null;
                        try
                        {
                            fields = lineParser.ReadFields();
                        }
                        catch (MalformedLineException ex)
                        {
                            errors.Add(new
                            {
                                key = "Row" + count,
                                value = string.Format("The row at line {0} is invalid.  Please check the data file submitted.  " +
                                "This row could not be parsed. Please double check the format of this row. "
                                , count)
                            });
                        }




                        lineParser.Close();



                        if (fields != null)
                        {

                            if (fields.Count() < 12)
                            {
                                errors.Add(new
                                {
                                    key = "Row" + count,
                                    value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 12 columns, but this row has less than 12." +
                                    "This can often happen if return or new line characters are included in the one of the fields.  " +
                                    "Make sure that return or new line characters are removed from each field .  Also check that there are only 12 columns.  ", count)
                                });
                            }
                            if (fields.Count() > 12)
                            {
                                errors.Add(new
                                {
                                    key = "Row" + count,
                                    value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 12 columns, but this row has more than 12." +
                                    "This can often happen if commas are included in the one of the fields.  " +
                                    "Make sure that commas are removed from each field or the field is surrounded by a double quote.  Also check that there are only 12 columns.  ", count)
                                });
                            }
                            if(fields.Count() == 12)
                            {
                                if (errors.Count < 200) //stop adding errors
                                {
                                    var errs = SamplesParseLine(true, dbContext, count, fields, hasWarning, listOfSamples);
                                    if (errs != null)
                                    {
                                        errors.AddRange(errs);
                                    }
                                }
                                else if (errors.Count == 200)
                                {
                                    errors.Add(new { key = "Row" + count, value = string.Format("You have reached the maximum 200 errors. There may be more errors associated with this file.", count) });
                                }

                            }
                        }
                    }

                    if (errors.Count > 0 && !hasWarning)
                    {
                        return Json(new { errors = errors, status = 409, success = false });
                    }
                }
            }

            //memoryStream = new MemoryStream(file.ContentLength);

            //file.InputStream.Position = 0;

            //file.InputStream.CopyTo(memoryStream);

            //memoryStream.Position = 0;

           

            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");

                    string[] headers = parser.Split(line);

                    while ((line = reader.ReadLine()) != null)
                    {
                        //Separating columns to array
                        TextFieldParser lineParser = new TextFieldParser(new StringReader(line));

                        lineParser.HasFieldsEnclosedInQuotes = true;
                        lineParser.SetDelimiters(",");


                        string[] fields = null;
                        try
                        {
                            fields = lineParser.ReadFields();
                        }
                        catch (MalformedLineException ex)
                        {
                            
                        }




                        lineParser.Close();



                        if (fields != null)
                        {

                            SamplesParseLine(false, dbContext, 1, fields, hasWarning,listOfSamples);
                        }
                    }
                }
            }

            return Json(new { status = 201, success = true });
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private ActionResult ExtractXlsx(HttpPostedFileBase file, ApplicationDbContext dbContext, bool hasWarning)
        {
            var memoryStream = new MemoryStream(file.ContentLength);
            var listOfSamples = new List<string>();
            file.InputStream.CopyTo(memoryStream);

            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(fileStream))
                {
                    excelReader.IsFirstRowAsColumnNames = true;

                    var errors = new List<object>();

                    int count = 1;

                    excelReader.Read();

                    while (excelReader.Read())
                    {
                        if (excelReader.FieldCount < 12)
                        {
                            errors.Add(new { key = "Row" + count, value = string.Format("The row at line {0} is invalid.  Please check the data file submitted.", count) });
                        }
                        else
                        {
                            List<string> fields = new List<string>();

                            fields.Add((excelReader.GetString(0) != null) ? excelReader.GetString(0) : "");
                            fields.Add((excelReader.GetString(1) != null) ? excelReader.GetString(1) : "");
                            fields.Add((excelReader.GetString(2) != null) ? excelReader.GetString(2) : "");
                            fields.Add((excelReader.GetString(3) != null) ? excelReader.GetString(3) : "");
                            fields.Add((excelReader.GetString(4) != null) ? excelReader.GetString(4) : "");
                            fields.Add((excelReader.GetString(5) != null) ? excelReader.GetString(5) : "");
                            fields.Add((excelReader.GetString(6) != null) ? excelReader.GetString(6) : "");
                            fields.Add((excelReader.GetString(7) != null) ? excelReader.GetString(7) : "");
                            fields.Add((excelReader.GetString(8) != null) ? excelReader.GetString(8) : "");
                            fields.Add((excelReader.GetString(9) != null) ? excelReader.GetString(9) : "");
                            fields.Add((excelReader.GetString(10) != null) ? excelReader.GetString(10) : "");
                            fields.Add((excelReader.GetString(11) != null) ? excelReader.GetString(11) : "");

                            var errs = SamplesParseLine(true, dbContext, count, fields.ToArray(), hasWarning,listOfSamples);

                            if (errs != null)
                            {
                                errors.AddRange(errs);
                            }
                        }

                        count++;
                    }

                    if (errors.Count > 0 && !hasWarning)
                    {
                        return Json(new { errors = errors, status = 409, success = false });
                    }
                }
            }

            memoryStream = new MemoryStream(file.ContentLength);

            file.InputStream.Position = 0;

            file.InputStream.CopyTo(memoryStream);

            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(fileStream))
                {
                    while (excelReader.Read())
                    {
                        List<string> fields = new List<string>();

                        fields.Add((excelReader.GetString(0) != null) ? excelReader.GetString(0) : "");
                        fields.Add((excelReader.GetString(1) != null) ? excelReader.GetString(1) : "");
                        fields.Add((excelReader.GetString(2) != null) ? excelReader.GetString(2) : "");
                        fields.Add((excelReader.GetString(3) != null) ? excelReader.GetString(3) : "");
                        fields.Add((excelReader.GetString(4) != null) ? excelReader.GetString(4) : "");
                        fields.Add((excelReader.GetString(5) != null) ? excelReader.GetString(5) : "");
                        fields.Add((excelReader.GetString(6) != null) ? excelReader.GetString(6) : "");
                        fields.Add((excelReader.GetString(7) != null) ? excelReader.GetString(7) : "");
                        fields.Add((excelReader.GetString(8) != null) ? excelReader.GetString(8) : "");
                        fields.Add((excelReader.GetString(9) != null) ? excelReader.GetString(9) : "");
                        fields.Add((excelReader.GetString(10) != null) ? excelReader.GetString(10) : "");
                        fields.Add((excelReader.GetString(11) != null) ? excelReader.GetString(11) : "");

                        SamplesParseLine(true, dbContext, 1, fields.ToArray(), hasWarning, listOfSamples);
                    }
                }
            }

            return Json(new { status = 201, success = true });
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SamplesParseLine(bool check, ApplicationDbContext dbContext, int count, string[] fields, bool hasWarning, List<string> listOfSamples)
        {
            string groupCode = fields[0];
            string stationCode = fields[1];
            string eventDate = fields[2];
            string eventTime = fields[3];
            string sampleDepth = fields[4];
            string sampleId = fields[5];
            string parameterType = fields[6];
            string parameterCode = fields[7];
            string sampleValue = fields[8];
            string qualifierCode = fields[9];
            string problemCode = fields[10];
            string sampleComments = fields[11];

            var errors = new List<object>();

            var group = dbContext.Groups.FirstOrDefault(g => g.Code.Equals(groupCode));

            if (group == null)
            {
                errors.Add(new { key = "Group" + count, value = string.Format("The group code provided in row {0} is invalid.  Please check the data file submitted.", count) });
            }

            var station = dbContext.Stations.FirstOrDefault(s => s.Code.Equals(stationCode));

            if (station == null)
            {
                errors.Add(new { key = "Station" + count, value = string.Format("The station code provided in row {0} is invalid.  Please check the data file submitted.", count) });
            }else if (station.Status == false)
            {
                errors.Add(new { key = "Station" + count, value = string.Format("The station provided in row {0} is invalid because the station has not been activated. Please activate this station under manage stations or check the data file submitted.", count) });
            }

            string strSample = eventDate + eventTime + stationCode + sampleDepth + parameterCode + sampleId;
            string pattern = "M/d/yyyy h:mm:ss tt";
            DateTime parsedDate;
            if (!DateTime.TryParseExact(eventDate + " " + eventTime, pattern, null, DateTimeStyles.None, out parsedDate))
            {
                pattern = "M/d/yyyy HH:mm:ss";
                if (!DateTime.TryParseExact(eventDate + " " + eventTime, pattern, null, DateTimeStyles.None, out parsedDate)){
                    errors.Add(new { key = "DateTime" + count, value = string.Format("The date/time provided in row {0} is invalid.  The date pattern should be 'm/d/yyyy' and the time pattern should be 'hh:mm:ss' or 'h:mm:ss tt'.  Please check the data file submitted.", count) });
                }
                
            }

            var qualifier = dbContext.Qualifiers.FirstOrDefault(q => q.Code.Equals(qualifierCode));

            var problem = dbContext.Problems.FirstOrDefault(p => p.Code.Equals(problemCode));

            var user = dbContext.Users.FirstOrDefault(u => u.UserName.Equals(this.HttpContext.User.Identity.Name));
            if (group == null )
            {
                errors.Add(new { key = "Row" + count, value = string.Format("The source code for row {0} does not have a matching Group in the database.  Please check the data file submitted.", count) });
                
            }
            if (station == null)
            {
                errors.Add(new { key = "Row" + count, value = string.Format("The station code for row {0} does not have a matching Station in the database.  Please check the data file submitted.", count) });
            }

            if (parsedDate == null)
            {
                errors.Add(new { key = "Row" + count, value = string.Format("The Sample Date value for row {0} is invalid.  Please check the data file submitted.", count) });
            }
            Event @event = new Event() ;
            if (group != null && station != null && parsedDate != null) {
                
                @event = dbContext.Events.FirstOrDefault(e =>
                    e.GroupId.Equals(group.Id) &&
                    e.StationId.Equals(station.Id) &&
                    e.DateTime.Equals(parsedDate)
                );

                if (@event == null && (!check | hasWarning))
                {
                    @event = new Event()
                    {
                        GroupId = group.Id,
                        StationId = station.Id,
                        DateTime = parsedDate,
                        CreatedBy = user.Id,
                        CreatedDate = DateTime.Now,
                        ModifiedBy = user.Id,
                        ModifiedDate = DateTime.Now,
                        Comments = sampleComments
                    };

                    dbContext.Events.Add(@event);
                    dbContext.SaveChanges();
                }
                if (parameterType.Equals("WaterQuality", StringComparison.InvariantCultureIgnoreCase))
                {
                    var waterQualityErrors = SaveWaterQuality(check, dbContext, count, sampleDepth, sampleId, parameterCode, sampleValue, problemCode, sampleComments, qualifier, @event, 
                        hasWarning, group.Id, listOfSamples, strSample);

                    errors.AddRange(waterQualityErrors);
                }
                else if (parameterType.Equals("Monitor", StringComparison.InvariantCultureIgnoreCase))
                {
                    var monitorLogErrors = SaveMonitorLog(check, dbContext, count, parameterCode, sampleValue, @event);

                    errors.AddRange(monitorLogErrors);
                }
                else if (parameterType.Equals("Condition", StringComparison.InvariantCultureIgnoreCase))
                {
                    var eventConditionErrors = SaveEventCondition(check, dbContext, count, parameterCode, sampleValue, @event);

                    errors.AddRange(eventConditionErrors);
                }
                else
                {
                    errors.Add(new { key = "SampleType" + count, value = string.Format("The parameter type provided in row {0} is unknown.  Please check that data provides one of the following values - WaterQuality, Monitor, Condition.  Also check for any extra spaces at the end of the string.", count) });
                }
            }

           
            

            return errors;
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SaveWaterQuality(bool check, ApplicationDbContext dbContext, int count,
            string sampleDepth, string sampleId, string parameterCode, 
            string sampleValue, string problemCode, string sampleComments, Qualifier qualifier, Event @event, bool hasWarning, int groupId, List<string> listOfSamples, string strSample)
        {
            var errors = new List<object>();

            decimal? depth;
            decimal? sValue;
            

            if (sampleDepth == "")
            {                
                depth = null;
            }
            else
            {
                decimal parsedDepth;
                if (!Decimal.TryParse(sampleDepth, out parsedDepth))
                {
                    errors.Add(new { key = "SampleDepth" + count, value = string.Format(
                        "The sample depth provided in row {0} is invalid."+
                        "The value could not be converted to a decimal and the value is not null." +
                        "Please check the data file submitted.", count) });
                    depth = null;                    
                }else
                {
                    depth = parsedDepth;
                }
            }
            

            decimal parsedValue;

            if (sampleValue == "")
            {
                sValue = null;
            }
            else
            {
                if (!Decimal.TryParse(sampleValue, out parsedValue))
                {
                    errors.Add(new { key = "SampleValue" + count, value = string.Format(
                        "The sample value provided in row {0} is invalid."+
                        " The value could not be parsed to a decimal and is not null. " +
                        "Please check the data file submitted.", count) });
                    sValue = null;
                }
                else
                {
                    sValue = parsedValue;
                }
            }

            int parsedSampleId;
            if (!int.TryParse(sampleId, out parsedSampleId))
            {
                errors.Add(new { key = "SampleId" + count, value = string.Format("The sample id provided in row {0} is invalid. The value could not be converted to an integer."+
                    "Please check the data file submitted.", count) });

            }
            else
            {
                if (parsedSampleId < 1 || parsedSampleId > 2)
                {
                    errors.Add(new
                    {
                        key = "SampleId" + count,
                        value = string.Format("The sample id in row {0} is not equal to 1 or 2." +
                             "Please check the data file submitted.", count)
                    });
                }
            }

            

            var parameter = dbContext.Parameters.FirstOrDefault(p => p.Code.Equals(parameterCode));
            decimal? lowLimit;
            decimal? uppLimit;
            decimal?[] validSampleDepths = {0.3M, .5M, 1M };
            

            if (parameter == null)
            {
                errors.Add(new { key = "Parameter" + count, value = string.Format(
                    "The parameter code provided in row {0} does not match a parameter" + 
                    " code in the database. ", count) });
                lowLimit = null;
                uppLimit = null;
            }
            else
            {
                lowLimit = parameter.NonfatalLowerRange;
                uppLimit = parameter.NonfatalUpperRange;

                //note for these. parameter.requiresSampleDepth is misleading - this means requires sample depth entry on form. for example, surface samples (typically .3, .5, or 1) for sample depth,
                //parameter.requiresSampleDepth is false because it is not required to be entered in field on form (it is an optional dropdown). However, nanitoke is a special case where surface samples
                //can fall outside of .3,.5., or 1 and they only bulk upload

                if (depth == null && parameter.Matrix == "Water" && !parameter.isCalibrationParameter)
                {
                    errors.Add(new
                    {
                        key = "Parameter" + count,
                        value = string.Format(
                       "The sample depth provided in row {0} is null. However, the associated parameter requires" +
                       " a sample depth.", count)
                    });
                }


               

                if (!validSampleDepths.Contains(depth) && (parameter.Matrix == "Water") && !parameter.requiresSampleDepth && groupId != 62 && !parameter.isCalibrationParameter) //nanticoke is only group that this error does not apply
                {
                    errors.Add(new
                    {
                        key = "Parameter" + count,
                        value = string.Format(
                       "The sample depth provided in row {0} is not equal to a valid surface sample depth (.3, .5, or 1). The associated parameter is a surface sample parameter" +
                       "and requires a valid surface sample depth.", count)
                    });
                }

                if (sValue < lowLimit && lowLimit != null)
                {
                    errors.Add(new
                    {
                        key = "ParameterLowLimit" + count,
                        value = string.Format(
                       "The value provided in row {0} is lower than the lower range check for this parameter", count),
                        warning = true
                    });
                }

                if (sValue > uppLimit && lowLimit != null)
                {
                    errors.Add(new
                    {
                        key = "ParameterUppLimit" + count,
                        value = string.Format(
                          "The value provided in row {0} is higher than the upper range check for this parameter", count),
                        warning = true
                    });
                }
            }
            

            var problem = dbContext.Problems.FirstOrDefault(p => p.Code.Equals(problemCode));
                 
            if (problem == null && problemCode != "")
            {
                errors.Add(new{key = "Sample" + count,
                    value = string.Format("The parameter code provided in row {0} does not match a parameter" +
                    " code in the database. ", count)
                   
                });
            }

            if (sValue == null && problem == null)
            {
                errors.Add(new
                {
                    key = "Sample" + count,
                    value = string.Format(
                        "The sample value and problem code provided in row {0} are both null." +
                        " You cannot upload a null value without an associated problem code." +
                        " Please check the data file submitted.", count)

                });
            }

            if (@event != null)
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The datetime and station provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing event in the database prior to uploading.", count) });
                if (parameter != null)
                {
                    var foundSample = dbContext.Samples.FirstOrDefault(s => s.EventId.Equals(@event.Id) && s.Depth == depth && s.ParameterId.Equals(parameter.Id) && s.SampleId.Equals(parsedSampleId));
                    if (foundSample != null)
                    {
                        errors.Add(new { key = "Sample" + count, value = string.Format("The water quality sample provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing sample in the database prior to uploading.", count) });
                    }
                }
                
            }

            
            string result = listOfSamples.Where(x => x.Contains(strSample)).FirstOrDefault();
            if (result == null)
            {
                listOfSamples.Add(strSample);
            }
            else
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The water quality sample provided in row {0} has at least one other matching sample based on the combination of Date, Time, Station, SampleDepth, Parameter, and SampleId. This combination must be unique for each sample. If this is an actual duplicate, make sure the samples are identified with a 1 and 2 for sampleId.", count) });
            }

            

            if (!check|hasWarning)
            {
                //force depth to null without error if prarameter is calibration parameter. This is helpful for groups that like to just populate entire bulk upload sample depth with same value. So, 
                //do not throw error but remove depth value.
                if (depth != null && parameter.isCalibrationParameter)
                {
                    depth = null;
                }
                Sample sample = new Sample()
                {
                    EventId = @event.Id,
                    Depth = depth,
                    SampleId = parsedSampleId,
                    ParameterId = parameter.Id,
                    Value = sValue,
                    QaFlagId = 1,
                    Comments = sampleComments,
                    CreatedBy = @event.CreatedBy,
                    CreatedDate = @event.CreatedDate,
                    ModifiedBy = @event.ModifiedBy,
                    ModifiedDate = @event.ModifiedDate
                };

                if (qualifier != null)
                {
                    sample.QualifierId = qualifier.Id;
                }

                dbContext.Samples.Add(sample);
                dbContext.SaveChanges();
            }

            return errors;
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SaveMonitorLog(bool check, ApplicationDbContext dbContext, int count, string parameterCode, string sampleValue, Event @event)
        {
            var errors = new List<object>();

            var user = dbContext.Users.FirstOrDefault(u => u.Code.Equals(parameterCode));

            if (user == null)
            {
                errors.Add(new { key = "Parameter" + count, value = string.Format(
                    "The monitor's code that you provided for the ParameterName column in row {0} is invalid." +
                    " The monitor code submitted for this row did not match an existing user's code in the database. ", count) });
            }

            if (@event != null)
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The datetime and station provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing event in the database prior to uploading.", count) });

            }

            decimal parsedValue;
            if (!Decimal.TryParse(sampleValue, out parsedValue))
            {
                errors.Add(new { key = "SampleValue" + count, value = string.Format("The sample value provided in row {0} is invalid. Could not convert to a decimal type number. Please check the data file submitted.", count) });
            }

            if (!check)
            {
                MonitorLog foundMonitorLog = null;
                if (user != null)
                {
                    foundMonitorLog = dbContext.MonitorLogs.FirstOrDefault(ml => ml.EventId.Equals(@event.Id) && ml.UserId.Equals(user.Id));
                }
                else
                {
                    errors.Add(new { key = "User" + count, value = string.Format("The monitor id provided in row {0} is invalid.  Please check the data file submitted.", count) });
                }

                if (foundMonitorLog == null && user != null)
                {

                    MonitorLog monitorLog = new MonitorLog()
                    {
                        UserId = user.Id,
                        EventId = @event.Id,
                        Hours = parsedValue,
                        CreatedBy = @event.CreatedBy,
                        CreatedDate = @event.CreatedDate,
                        ModifiedBy = @event.ModifiedBy,
                        ModifiedDate = @event.ModifiedDate

                    };

                    dbContext.MonitorLogs.Add(monitorLog);
                    dbContext.SaveChanges();
                }
            }

            return errors;
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> SaveEventCondition(bool check, ApplicationDbContext dbContext, int count, string parameterCode, string sampleValue, Event @event)
        {
            var errors = new List<object>();
            

            var condition = dbContext.Conditions.FirstOrDefault(c => c.Code.Equals(parameterCode));

            if (condition == null)
            {
                errors.Add(new { key = "Condition" + count, value = string.Format("The condition code, " + parameterCode + 
                    ", provided in row {0} does not match a condition in the database. " +
                    "Please check the data file submitted.  To resolve, revise the code in column 'ParameterName'" +
                    " in this row to match a condition code in the database.", count) });
            }
            else
            {
                if (sampleValue == "")
                {
                    errors.Add(new { key = "Condition" + count, value = string.Format("The condition value provided in row {0} is invalid." +  
                        " The value provided for the condition cannot be null. To resolve, either delete this row or add a valid condition category", count) });
                }
                else
                {
                    var conditionCategories = dbContext.ConditionCategories.Where(cc => cc.ConditionId.Equals(condition.Id));
                    if ((condition.isCategorical && !conditionCategories.Any(c => c.Category.Equals(sampleValue))))
                    {
                        errors.Add(new { key = "Condition" + count, value = string.Format("The condition value provided in row {0} is invalid. The value provided for the condition in this row is not a valid category", count) });
                    }
                }         
            }

            if (@event != null)
            {
                errors.Add(new { key = "Sample" + count, value = string.Format("The datetime and station provided in row {0} has already been added to the database.  Please check the data file submitted or delete the existing event in the database prior to uploading.", count) });

            }
            if (!check)
            {
                var foundEventCondition = dbContext.EventConditions.FirstOrDefault(ec => ec.EventId.Equals(@event.Id) && ec.ConditionId.Equals(condition.Id));

                if (foundEventCondition == null)
                {

                    EventCondition eventCondition = new EventCondition()
                    {
                        ConditionId = condition.Id,
                        EventId = @event.Id,
                        Value = sampleValue
                    };


                    dbContext.EventConditions.Add(eventCondition);
                    dbContext.SaveChanges();

                }
                else
                {
                    errors.Add(new { key = "Condition" + count, value = string.Format("The condition provided in row {0} is invalid. This condition already exists in the database. Consider deleting the condition prior to upload", count) });
                }
            }
            return errors;
        }
        #endregion SamplesBulk
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        #region StationsBulk
        [HttpPost]
        public ActionResult StationsBulk(FormCollection form, HttpPostedFileBase file)
        {
            if (!(file != null && file.ContentLength > 0))
            {
                return Json(false);
            }

            ApplicationDbContext dbContext = new ApplicationDbContext();

            var memoryStream = new MemoryStream(file.ContentLength);

            file.InputStream.CopyTo(memoryStream);
            memoryStream.Position = 0;


            var content = string.Empty;
            using (StreamReader reader = new StreamReader(memoryStream))
            {
                content = reader.ReadToEnd();
                reader.Close();

            }

            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\n+", string.Empty);
            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\r+", string.Empty);

            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");


                    string[] headers = parser.Split(line);

                    var errors = new List<object>();

                    int count = 1;

                    while ((line = reader.ReadLine()) != null)
                    {
                        count++;


                        
                        var errs = StationsParseLine(true, dbContext, count, line);

                        if (errs != null)
                        {
                            errors.AddRange(errs);
                        }
                    }

                    if (errors.Count > 0)
                    {
                        return Json(new { errors = errors, status = 409, success = false });
                    }
                }
            }

            //memoryStream = new MemoryStream(file.ContentLength);

            //file.InputStream.Position = 0;

            //file.InputStream.CopyTo(memoryStream);

            //memoryStream.Position = 0;



            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Separating columns to array
                    TextFieldParser lineParser = new TextFieldParser(new StringReader(line));

                    lineParser.HasFieldsEnclosedInQuotes = true;
                    lineParser.SetDelimiters(",");


                    string[] fields = null;
                    try
                    {
                        fields = lineParser.ReadFields();
                    }
                    catch (MalformedLineException ex)
                    {
                        
                    }




                    lineParser.Close();



                    if (fields != null)
                    {

                        while ((line = reader.ReadLine()) != null)
                        {
                            StationsParseLine(false, dbContext, 1, line);
                        }
                    }
                }
            }

            return Json(new { status = 201, success = true });
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> StationsParseLine(bool check, ApplicationDbContext dbContext, int count, string line)
        {
            


            TextFieldParser parser = new TextFieldParser(new StringReader(line));

            var errors = new List<object>();

            parser.HasFieldsEnclosedInQuotes = true;
            parser.SetDelimiters(",");

            string[] fields = null;
            try
            {
                fields = parser.ReadFields();
            }
            catch (MalformedLineException ex)
            {
                errors.Add(new
                {
                    key = "Row" + count,
                    value = string.Format("The row at line {0} is invalid.  Please check the data file submitted.  " +
                    "This row could not be parsed. Please double check the format of this row. "                    
                    , count)
                });
            }
                
           
            

            parser.Close();



            if (fields != null)
            {

                if (fields.Count() > 6)
                {
                    errors.Add(new
                    {
                        key = "Row" + count,
                        value = string.Format("The row at line {0} is invalid.  Please check the data file submitted.  " +
                        "This row should have 6 columns/fields, but this row has more than 6.  " + 
                        "This can often happen if commas are included in the one of the fields.  " + 
                        "Make sure that commas are removed from each field or that the filed is surrounded by a double quotes.  Also check that there are only 6 columns.  "
                        , count)
                    });

                    return errors;
                }

                if (fields.Count() < 6)
                {
                    errors.Add(new
                    {
                        key = "Row" + count,
                        value = string.Format("The row at line {0} is invalid.  Please check the data file submitted.  " +
                        "This row should have 6 columns/fields, but this row has less than 6.  " +
                        "This can often happen if there are return characters in one of the fields.  " +
                        "Make sure that any return or new line characters are removed from each field. Also check that there are only 6 columns.  "
                        , count)
                    });

                    return errors;
                }

            
                string stationCode = fields[0];
                string name = fields[1];
                string description = fields[2];
                //string waterBody = fields[3];
                string lat = fields[3];
                string lon = fields[4];
                //string datum = fields[6];
                //string tidal = fields[7];
                string comments = fields[5];
                //string cityCounty = fields[9];

                decimal parsedLat;
                if (!decimal.TryParse(lat, out parsedLat))
                {
                    errors.Add(new { key = "Latitude" + count, value = string.Format("The station latitude provided in row {0} is invalid. Unable to convert to number.  Please check the data file submitted.", count) });
                }
                else
                {
                    int decCnt = BitConverter.GetBytes(decimal.GetBits(decimal.Parse(lat))[3])[2];
                    if (decCnt < 4)
                    {
                        errors.Add(new { key = "Latitude2" + count, value = string.Format("The station latitude provided in row {0} is invalid.  The latitude must contain at least 4 decimal places. Please check the data file submitted.", count) });
                    }
                }



                decimal parsedLon;
                if (!decimal.TryParse(lon, out parsedLon))
                {
                    errors.Add(new { key = "Longitude" + count, value = string.Format("The station longitude provided in row {0} is invalid.  Please check the data file submitted.", count) });
                }
                else
                {
                    int decCnt = BitConverter.GetBytes(decimal.GetBits(decimal.Parse(lon))[3])[2];
                    if (decCnt < 4)
                    {
                        errors.Add(new { key = "Longitude2" + count, value = string.Format("The station longitude provided in row {0} is invalid.  The longitude must contain at least 4 decimal places. Please check the data file submitted.", count) });
                    }
                }

                var existingStation = dbContext.Stations.FirstOrDefault(p => p.Code.Equals(stationCode));

                if (existingStation != null)
                {
                    errors.Add(new { key = "Station" + count, value = string.Format("The station code provided in row {0} matches a station that already exists in the database.  Please check the data file submitted.", count) });
                }

                var groupCode = stationCode.Split('.')[0];
                var group = dbContext.Groups.FirstOrDefault(p => p.Code.Equals(groupCode));
                if (group == null)
                {
                    errors.Add(new
                    {
                        key = "Group" + count,
                        value = string.Format("The group code identified before the '.' in the Name column in row {0} does not match a group code in the database." +
                        "Please check the data file submitted. Enter a 'Y' or 'N' only.", count)
                    });
                }
                var url = "https://gis.chesapeakebay.net/ags/rest/services/geotagging/nad83/MapServer/identify?geometry=" +
                    parsedLon.ToString() + "%2C" + parsedLat.ToString() +
                    "&geometryType=esriGeometryPoint&sr=&layers=all&layerDefs=&time=&layerTimeOptions=&tolerance=0&mapExtent=-80.6%2C36.5%2C-76.1%2C42.5&imageDisplay=2000%2C2000%2C96&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson";

                var jsonReturn = new WebClient().DownloadString(url);

                dynamic json = JsonConvert.DeserializeObject(jsonReturn);
                dynamic results = JsonConvert.DeserializeObject(json.results.ToString());
                
                if(results.Count == 0)
                {
                    errors.Add(new
                    {
                        key = "bounds" + count,
                        value = string.Format("Please check the latitude and longitude in row {0}, " +
                        "as we have determined it to fall outside of the Chesapeake Bay Watershed.", count)
                    });
                }




                if (!check)
                {
                    var id = HttpContext.User.Identity.GetUserId();
                    url = "http://gis.chesapeakebay.net/ags/rest/services/geotagging/nad83/MapServer/identify?geometry=" +
                    parsedLon.ToString() + "%2C" + parsedLat.ToString() +
                    "&geometryType=esriGeometryPoint&sr=&layers=all&layerDefs=&time=&layerTimeOptions=&tolerance=0&mapExtent=-80.6%2C36.5%2C-76.1%2C42.5&imageDisplay=2000%2C2000%2C96&returnGeometry=false&maxAllowableOffset=&geometryPrecision=&dynamicLayers=&returnZ=false&returnM=false&gdbVersion=&f=pjson";

                    jsonReturn = new WebClient().DownloadString(url);

                    json = JsonConvert.DeserializeObject(jsonReturn);
                    results = JsonConvert.DeserializeObject(json.results.ToString());
                    string huc12 = "";
                    string waterBodyBp = "";
                    string fips = "";
                    string state = "";
                    string cityCounty = "";
                    bool tidalBp = false;
                    foreach (var item in results)
                    {
                        if (item.layerName.Value == "HUC12")
                        {
                            huc12 = item.attributes.HUC_12.Value;
                            waterBodyBp = item.attributes.HU_12_NAME.Value;
                        }
                        else if (item.layerName.Value == "FIPS")
                        {
                            fips = item.value.Value;
                            state = item.attributes.StName;
                            cityCounty = item.attributes.CoNameFull;
                        }
                        else if (item.layerName.Value == "Fall_line")
                        {
                            if (item.value.Value == "below")
                            {
                                tidalBp = true;
                            }
                            else
                            {
                                tidalBp = false;
                            }
                        }
                    }

                    var station = new Station()
                    {
                        Code = stationCode,
                        Name = name,
                        Description = description,
                        WaterBody = waterBodyBp,
                        Lat = parsedLat,
                        Long = parsedLon,
                        Datum = "NAD83",
                        Tidal = tidalBp,
                        Fips = fips,
                        Huc12 = huc12,
                        State = state,
                        CityCounty = cityCounty,
                        Comments = comments,
                        Status = true,
                        CreatedBy = id,
                        CreatedDate = DateTime.Now,
                        ModifiedBy = id,
                        ModifiedDate = DateTime.Now
                    };



                    dbContext.Stations.Add(station);

                    dbContext.SaveChanges();

                    var stationId = dbContext.Stations.FirstOrDefault(c => c.Code.Equals(stationCode)).Id;

                    groupCode = stationCode.Split('.')[0];
                    var groupId = dbContext.Groups.FirstOrDefault(c => c.Code.Equals(groupCode)).Id;

                    var stationGroup = new StationGroup
                    {
                        StationId = stationId,
                        GroupId = groupId,
                        CreatedBy = id,
                        CreatedDate = DateTime.Now,
                        ModifiedBy = id,
                        ModifiedDate = DateTime.Now
                    };

                    dbContext.StationGroups.Add(stationGroup);
                    dbContext.SaveChanges();
                }
            }
            return errors;
        }
        #endregion StationsBulk
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        #region UsersBulk
        [HttpPost]
        public ActionResult UsersBulk(FormCollection form, HttpPostedFileBase file)
        {
            if (!(file != null && file.ContentLength > 0))
            {
                return Json(false);
            }

            ApplicationDbContext dbContext = new ApplicationDbContext();

            var memoryStream = new MemoryStream(file.ContentLength);

            file.InputStream.CopyTo(memoryStream);
            memoryStream.Position = 0;


            var content = string.Empty;
            using (StreamReader reader = new StreamReader(memoryStream))
            {
                content = reader.ReadToEnd();
                reader.Close();

            }

            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\n+", string.Empty);
            content = Regex.Replace(content, "(?!(([^\"]*\"){2})*[^\"]*$)\r+", string.Empty);

            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))"); 

                    string[] headers = parser.Split(line);

                    var errors = new List<object>();

                    int count = 1;

                    while ((line = reader.ReadLine()) != null)
                    {
                        count++;

                        var errs = UsersParseLine(true, dbContext, count, line, parser);

                        if (errs != null)
                        {
                            errors.AddRange(errs);
                        }
                    }

                    if (errors.Count > 0)
                    {
                        return Json(new { errors = errors, status = 409, success = false });
                    }
                }
            }

            //memoryStream = new MemoryStream(file.ContentLength);

            //file.InputStream.Position = 0;

            //file.InputStream.CopyTo(memoryStream);

            //memoryStream.Position = 0;



            memoryStream = Extensions.ToStream(content);
            memoryStream.Position = 0;

            using (var fileStream = memoryStream)
            {
                using (StreamReader reader = new StreamReader(fileStream))
                {
                    string line;

                    //Read the first line
                    line = reader.ReadLine();

                    //Define pattern
                    Regex parser = new Regex(",(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");

                    string[] headers = parser.Split(line);

                    while ((line = reader.ReadLine()) != null)
                    {
                        UsersParseLine(false, dbContext, 1, line, parser);
                    }
                }
            }

            return Json(new { status = 201, success = true });
        }
        [Authorize(Roles = "Admin, Officer, Member, Coordinator")]
        private List<object> UsersParseLine(bool check, ApplicationDbContext dbContext, int count, string line, Regex parser)
        {
            //Separating columns to array
            string[] fields = parser.Split(line);

            var errors = new List<object>();

            if (fields.Count() < 4)
            {
                errors.Add(new { key = "Row" + count, value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. " +
                    "This row should have 4 columns/fields, but this row has less than 4."+
                    " This can often happen if return or new line characters are included in the one of the fields.  " + 
                    "  Also check that there are only 4 columns.  ", count) });

                return errors;
            }

            if (fields.Count() > 4)
            {
                errors.Add(new { key = "Row" + count, value = string.Format("The row at line {0} is invalid.  Please check the data file submitted. This row should have 4 columns/fields, but this row has greater than 4." +
                     "This can often happen if commas are included in the one of the fields.  " +
                    "Make sure that commas are removed from each field or that the filed is surrounded by a double quotes.  Also check that there are only 4 columns.  ", count) });

                return errors;
            }

            string code = fields[0];
            string groupCode = fields[1];
            string firstName = fields[2];
            string lastName = fields[3];

            var group = dbContext.Groups.FirstOrDefault(g => g.Code.Equals(groupCode));

            if (group == null)
            {
                errors.Add(new { key = "Group" + count, value = string.Format("The group code provided in row {0} is invalid.  Please check the data file submitted.", count) });
            }

            var username = "test" + new Random().Next(1000000, 1000000000) + "@cmcapplication.com";

            if (UserManager.FindByName(username) != null)
            {
                errors.Add(new { key = "User" + count, value = string.Format("The username at line {0} is already taken.  Please check the data file submitted.", count) });
            }

            else if (!check)
            {
                var user = new ApplicationUser();
                var id = HttpContext.User.Identity.GetUserId();
                user.Code = code;
                user.UserName = username;
                user.GroupId = group.Id;
                user.FirstName = firstName;
                user.LastName = lastName;
                user.Status = true;
                user.CreatedBy = id;
                user.CreatedDate = DateTime.Now;
                user.ModifiedBy = id;
                user.ModifiedDate = DateTime.Now;
                user.CertificationDate = DateTime.Now;

                user.HasBeenActivated = false;
                user.Email = username;
                var foundUser = UserManager.FindByName(user.UserName);

                if (foundUser == null)
                {
                    var pwd = System.Web.Security.Membership.GeneratePassword(10, 5) + '0';
                    var test = UserManager.Create(user, pwd);

                    //dbContext.Users.Add(user);
                    UserManager.AddToRole(user.Id, "Monitor");
                    dbContext.SaveChanges();
                }
            }

            return errors;
        }
#endregion UsersBulk

        public ActionResult Documents()
        {
            return View();
        }

        public async Task<ActionResult> userProfile()
        {
            var id = HttpContext.User.Identity.GetUserId();
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = await UserManager.FindByIdAsync(id);

            var context = new ApplicationDbContext();
            //var users = context.Users.Where(x => x.Roles.Select(y => y.RoleId).Contains("Volunteer")).ToListAsync();           

            
            var userRoles = await UserManager.GetRolesAsync(user.Id);

            
            ViewBag.RoleNames = userRoles;
            ViewBag.GroupName = context.Groups.Where(g => g.Id.Equals(user.GroupId)).Select(n => n.Name);
            ViewBag.VolunteerHours = context.MonitorLogs.Where(v => v.UserId.Equals(user.Id)).AsEnumerable().Sum(o => o.Hours);             

            ViewBag.Name = user.FirstName;
            return View(user);
        }

        public FileContentResult GetProfileImage(string id)
        {
            if (User.Identity.IsAuthenticated)
            {
                if (id == null)
                {
                    id = User.Identity.GetUserId();
                }
                    
                // to get the user details to load user Image 
                var user = UserManager.FindById(id);
                var userImage = user.ProfileImage;
                if (userImage == null)
                {
                    string fileName = HttpContext.Server.MapPath(@"~/Images/Profile/noImg.png");

                    byte[] imageData = null;
                    FileInfo fileInfo = new FileInfo(fileName);
                    long imageFileLength = fileInfo.Length;
                    FileStream fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                    BinaryReader br = new BinaryReader(fs);
                    imageData = br.ReadBytes((int)imageFileLength);

                    return File(imageData, "image/png");

                }
                

                return new FileContentResult(userImage, "image/jpeg");
            }
            else
            {
                string fileName = HttpContext.Server.MapPath(@"~/Images/noImg.png");

                byte[] imageData = null;
                FileInfo fileInfo = new FileInfo(fileName);
                long imageFileLength = fileInfo.Length;
                FileStream fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                imageData = br.ReadBytes((int)imageFileLength);
                return File(imageData, "image/png");

            }
        }
        

    }
}