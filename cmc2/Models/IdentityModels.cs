using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration.Conventions;
using Newtonsoft.Json;
using System.Runtime.Serialization;


namespace cmc2.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
        [Display(Name="First Name")]
        public string FirstName { get; set; }
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        public bool Status { get; set; }
        
        [Display(Name = "Volunteer Hours")]
        public decimal VolunteerHours { get; set; }
        [Column(TypeName = "DateTime2")]
        public DateTime GroupUpdatedDateTime { get; set; }
        [Display(Name = "Profile Image")]        
        public byte[] ProfileImage { get; set; }
        [Display(Name = "Home Phone")]
        public string HomePhone { get; set; }
        [Display(Name = "Cell Phone")]
        public string CellPhone { get; set; }
        [Display(Name = "Emergency Phone")]
        public string EmergencyPhone { get; set; }
        [Display(Name = "Address First")]
        public string AddressFirst { get; set; }
        [Display(Name = "Address Second")]
        public string AddressSecond { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        [StringLength(450)]
        [Index(IsUnique = true)]
        public string Code { get; set; }

        public DateTime CertificationDate { get; set; }
        
        public bool HasBeenActivated { get; set; }

        // Foreign Key
        public int GroupId { get; set; }
        
        //Navigation property
        public Group Group { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime ModifiedDate { get; set; }

    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            //this.Configuration.LazyLoadingEnabled = false;
            this.Configuration.ProxyCreationEnabled = false;
        }
        
        public DbSet<Event> Events { get; set; }
        public DbSet<BenthicEvent> BenthicEvents { get; set; }
        public DbSet<BenthicEventCondition> BenthicEventConditions { get; set; }
        public DbSet<BenthicCondition> BenthicConditions { get; set; }
        public DbSet<BenthicConditionCategory> BenthicConditionCategories { get; set; }
        public DbSet<BenthicMonitorLog> BenthicMonitorLogs { get; set; }
        public DbSet<Group> Groups { get; set; }

        public DbSet<Station> Stations { get; set; }

        public DbSet<Sample> Samples { get; set; }
        public DbSet<BenthicSample> BenthicSamples { get; set; }
        public DbSet<Parameter> Parameters { get; set; }
        public DbSet<BenthicParameter> BenthicParameters { get; set; }
        public DbSet<ConditionCategory> ConditionCategories { get; set; }
        public DbSet<QaFlag> QaFlags { get; set; }
        public DbSet<ParameterGroup> ParameterGroups { get; set; }
        public DbSet<StationGroup> StationGroups { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<Qualifier> Qualifiers { get; set; }
        public DbSet<MonitorLog> MonitorLogs { get; set; }
        public DbSet<Lab> Labs { get; set; }
        public DbSet<Condition> Conditions { get; set; }
        public DbSet<EventCondition> EventConditions { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            modelBuilder.Conventions.Remove<DecimalPropertyConvention>();
            modelBuilder.Conventions.Add(new DecimalPropertyConvention(16, 10));
            
            base.OnModelCreating(modelBuilder);
            
        }



        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        //public System.Data.Entity.DbSet<cmc2.Models.ApplicationUser> ApplicationUsers { get; set; }

        public DbSet<ApplicationUser> GetApplicationUsers()
        {
            return (DbSet<ApplicationUser>)Users;
        }

        public System.Data.Entity.DbSet<cmc2.Models.RelatedParameter> RelatedParameters { get; set; }

        public System.Data.Entity.DbSet<cmc2.Models.StationSamplingMethod> StationSamplingMethods { get; set; }
    }
}