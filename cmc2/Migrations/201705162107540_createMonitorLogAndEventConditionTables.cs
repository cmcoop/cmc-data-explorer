namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class createMonitorLogAndEventConditionTables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EventConditions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EventId = c.Int(nullable: false),
                        ConditionId = c.Int(nullable: false),
                        Value = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Conditions", t => t.ConditionId, cascadeDelete: true)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .Index(t => new { t.EventId, t.ConditionId }, unique: true, name: "IX_GroupParameter");
            
            CreateTable(
                "dbo.MonitorLogs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        Hours = c.Int(nullable: false),
                        EventId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .ForeignKey("dbo.Events", t => t.EventId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.EventId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.MonitorLogs", "EventId", "dbo.Events");
            DropForeignKey("dbo.MonitorLogs", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.EventConditions", "EventId", "dbo.Events");
            DropForeignKey("dbo.EventConditions", "ConditionId", "dbo.Conditions");
            DropIndex("dbo.MonitorLogs", new[] { "EventId" });
            DropIndex("dbo.MonitorLogs", new[] { "UserId" });
            DropIndex("dbo.EventConditions", "IX_GroupParameter");
            DropTable("dbo.MonitorLogs");
            DropTable("dbo.EventConditions");
        }
    }
}
