namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addBenthicMonitorLogs : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BenthicMonitorLogs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        Hours = c.Decimal(nullable: false, precision: 16, scale: 10),
                        BenthicEventId = c.Int(nullable: false),
                        CreatedBy = c.String(maxLength: 128),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedBy = c.String(maxLength: 128),
                        ModifiedDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .ForeignKey("dbo.BenthicEvents", t => t.BenthicEventId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.CreatedBy)
                .ForeignKey("dbo.AspNetUsers", t => t.ModifiedBy)
                .Index(t => t.UserId)
                .Index(t => t.BenthicEventId)
                .Index(t => t.CreatedBy)
                .Index(t => t.ModifiedBy);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BenthicMonitorLogs", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.BenthicMonitorLogs", "CreatedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.BenthicMonitorLogs", "BenthicEventId", "dbo.BenthicEvents");
            DropForeignKey("dbo.BenthicMonitorLogs", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.BenthicMonitorLogs", new[] { "ModifiedBy" });
            DropIndex("dbo.BenthicMonitorLogs", new[] { "CreatedBy" });
            DropIndex("dbo.BenthicMonitorLogs", new[] { "BenthicEventId" });
            DropIndex("dbo.BenthicMonitorLogs", new[] { "UserId" });
            DropTable("dbo.BenthicMonitorLogs");
        }
    }
}
