namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCreatedAndModifiedByToMonitorLog : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.MonitorLogs", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.MonitorLogs", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.MonitorLogs", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.MonitorLogs", "ModifiedDate", c => c.DateTime(nullable: false));
            CreateIndex("dbo.MonitorLogs", "CreatedBy");
            CreateIndex("dbo.MonitorLogs", "ModifiedBy");
            AddForeignKey("dbo.MonitorLogs", "CreatedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.MonitorLogs", "ModifiedBy", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.MonitorLogs", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.MonitorLogs", "CreatedBy", "dbo.AspNetUsers");
            DropIndex("dbo.MonitorLogs", new[] { "ModifiedBy" });
            DropIndex("dbo.MonitorLogs", new[] { "CreatedBy" });
            DropColumn("dbo.MonitorLogs", "ModifiedDate");
            DropColumn("dbo.MonitorLogs", "ModifiedBy");
            DropColumn("dbo.MonitorLogs", "CreatedDate");
            DropColumn("dbo.MonitorLogs", "CreatedBy");
        }
    }
}
