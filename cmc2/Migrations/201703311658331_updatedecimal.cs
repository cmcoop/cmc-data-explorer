namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updatedecimal : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Stations", "Lat", c => c.Decimal(nullable: false, precision: 16, scale: 10));
            AlterColumn("dbo.Stations", "Long", c => c.Decimal(nullable: false, precision: 16, scale: 10));
            AlterColumn("dbo.Samples", "Value", c => c.Decimal(nullable: false, precision: 16, scale: 10));
            AlterColumn("dbo.Samples", "Depth", c => c.Decimal(nullable: false, precision: 16, scale: 10));
            AlterColumn("dbo.AspNetUsers", "VolunteerHours", c => c.Decimal(nullable: false, precision: 16, scale: 10));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.AspNetUsers", "VolunteerHours", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Samples", "Depth", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Samples", "Value", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Stations", "Long", c => c.Decimal(nullable: false, precision: 18, scale: 2));
            AlterColumn("dbo.Stations", "Lat", c => c.Decimal(nullable: false, precision: 18, scale: 2));
        }
    }
}
