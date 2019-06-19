namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class setupBenthics : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BenthicEvents",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DateTime = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        Comments = c.String(),
                        StationId = c.Int(nullable: false),
                        GroupId = c.Int(nullable: false),
                        CreatedBy = c.String(maxLength: 128),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedBy = c.String(maxLength: 128),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedBy)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedBy)
                .ForeignKey("dbo.Stations", t => t.StationId, cascadeDelete: true)
                .Index(t => t.StationId)
                .Index(t => t.GroupId)
                .Index(t => t.CreatedBy)
                .Index(t => t.ModifiedBy);
            
            CreateTable(
                "dbo.BenthicParameters",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false, maxLength: 450),
                        Name = c.String(),
                        Method = c.String(),
                        Comments = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Code, unique: true);
            
            CreateTable(
                "dbo.BenthicSamples",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Value = c.Decimal(nullable: false, precision: 16, scale: 10),
                        Comments = c.String(),
                        EventBenthicId = c.Int(nullable: false),
                        ParameterBenthicId = c.Int(nullable: false),
                        QaFlagId = c.Int(nullable: false),
                        CreatedBy = c.String(maxLength: 128),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedBy = c.String(maxLength: 128),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedBy)
                .ForeignKey("dbo.Events", t => t.EventBenthicId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedBy)
                .ForeignKey("dbo.Parameters", t => t.ParameterBenthicId, cascadeDelete: true)
                .ForeignKey("dbo.QaFlags", t => t.QaFlagId, cascadeDelete: true)
                .Index(t => t.EventBenthicId)
                .Index(t => t.ParameterBenthicId)
                .Index(t => t.QaFlagId)
                .Index(t => t.CreatedBy)
                .Index(t => t.ModifiedBy);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BenthicSamples", "QaFlagId", "dbo.QaFlags");
            DropForeignKey("dbo.BenthicSamples", "ParameterBenthicId", "dbo.Parameters");
            DropForeignKey("dbo.BenthicSamples", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.BenthicSamples", "EventBenthicId", "dbo.Events");
            DropForeignKey("dbo.BenthicSamples", "CreatedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.BenthicEvents", "StationId", "dbo.Stations");
            DropForeignKey("dbo.BenthicEvents", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.BenthicEvents", "GroupId", "dbo.Groups");
            DropForeignKey("dbo.BenthicEvents", "CreatedBy", "dbo.AspNetUsers");
            DropIndex("dbo.BenthicSamples", new[] { "ModifiedBy" });
            DropIndex("dbo.BenthicSamples", new[] { "CreatedBy" });
            DropIndex("dbo.BenthicSamples", new[] { "QaFlagId" });
            DropIndex("dbo.BenthicSamples", new[] { "ParameterBenthicId" });
            DropIndex("dbo.BenthicSamples", new[] { "EventBenthicId" });
            DropIndex("dbo.BenthicParameters", new[] { "Code" });
            DropIndex("dbo.BenthicEvents", new[] { "ModifiedBy" });
            DropIndex("dbo.BenthicEvents", new[] { "CreatedBy" });
            DropIndex("dbo.BenthicEvents", new[] { "GroupId" });
            DropIndex("dbo.BenthicEvents", new[] { "StationId" });
            DropTable("dbo.BenthicSamples");
            DropTable("dbo.BenthicParameters");
            DropTable("dbo.BenthicEvents");
        }
    }
}
