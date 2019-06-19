namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Events",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DateTime = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        Project = c.String(),
                        Comments = c.String(),
                        GroupId = c.Int(nullable: false),
                        StationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.Stations", t => t.StationId, cascadeDelete: true)
                .Index(t => t.GroupId)
                .Index(t => t.StationId);
            
            CreateTable(
                "dbo.Groups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        ContactName = c.String(),
                        ContactEmail = c.String(),
                        ContactCellPhone = c.String(),
                        ContactOfficePhone = c.String(),
                        ParametersSampled = c.String(),
                        Description = c.String(),
                        Url = c.String(),
                        Logo = c.Binary(),
                        AddressFirst = c.String(),
                        AddressSecond = c.String(),
                        City = c.String(),
                        State = c.String(),
                        Zip = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ParameterGroups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        ParameterId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.Parameters", t => t.ParameterId, cascadeDelete: true)
                .Index(t => new { t.GroupId, t.ParameterId }, unique: true, name: "IX_GroupParameter");
            
            CreateTable(
                "dbo.Parameters",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Units = c.String(),
                        Method = c.String(),
                        Tier = c.String(),
                        Matrix = c.String(),
                        Tidal = c.String(),
                        NonTidal = c.String(),
                        AnalyticalMethod = c.String(),
                        ApprovedProcedure = c.String(),
                        Equipment = c.String(),
                        Precision = c.String(),
                        Accuracy = c.String(),
                        Range = c.String(),
                        InSituOrLab = c.String(),
                        QcCriteria = c.String(),
                        InspectionFreq = c.String(),
                        InspectionType = c.String(),
                        CalibrationFrequency = c.String(),
                        StandardOrCalInstrumentUsed = c.String(),
                        TierIIAdditionalReqs = c.String(),
                        HoldingTime = c.String(),
                        SamplePreservation = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Stations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        NameLong = c.String(),
                        Lat = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Long = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Cbseg = c.String(),
                        WaterBody = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Samples",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Value = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Depth = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SampleId = c.String(),
                        Problem = c.String(),
                        Qualifier = c.String(),
                        Comments = c.String(),
                        EventId = c.Int(nullable: false),
                        ParameterId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .ForeignKey("dbo.Parameters", t => t.ParameterId, cascadeDelete: true)
                .Index(t => t.EventId)
                .Index(t => t.ParameterId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Status = c.Boolean(nullable: false),
                        VolunteerHours = c.Decimal(nullable: false, precision: 18, scale: 2),
                        GroupUpdatedDateTime = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        ProfileImage = c.Binary(),
                        HomePhone = c.String(),
                        CellPhone = c.String(),
                        EmergencyPhone = c.String(),
                        AddressFirst = c.String(),
                        AddressSecond = c.String(),
                        City = c.String(),
                        State = c.String(),
                        Zip = c.String(),
                        GroupId = c.Int(nullable: false),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .Index(t => t.GroupId)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUsers", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Samples", "ParameterId", "dbo.Parameters");
            DropForeignKey("dbo.Samples", "EventId", "dbo.Events");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.Events", "StationId", "dbo.Stations");
            DropForeignKey("dbo.Events", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.ParameterGroups", "ParameterId", "dbo.Parameters");
            DropForeignKey("dbo.ParameterGroups", "GroupId", "dbo.Groups");
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUsers", new[] { "GroupId" });
            DropIndex("dbo.Samples", new[] { "ParameterId" });
            DropIndex("dbo.Samples", new[] { "EventId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.ParameterGroups", "IX_GroupParameter");
            DropIndex("dbo.Events", new[] { "StationId" });
            DropIndex("dbo.Events", new[] { "GroupId" });
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.Samples");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.Stations");
            DropTable("dbo.Parameters");
            DropTable("dbo.ParameterGroups");
            DropTable("dbo.Groups");
            DropTable("dbo.Events");
        }
    }
}
