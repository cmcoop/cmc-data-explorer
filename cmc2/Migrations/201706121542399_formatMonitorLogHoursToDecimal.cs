namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class formatMonitorLogHoursToDecimal : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.MonitorLogs", "Hours", c => c.Decimal(nullable: false, precision: 16, scale: 10));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.MonitorLogs", "Hours", c => c.Int(nullable: false));
        }
    }
}
