namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addHucAndFipstoStation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stations", "Fips", c => c.String());
            AddColumn("dbo.Stations", "Huc12", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stations", "Huc12");
            DropColumn("dbo.Stations", "Fips");
        }
    }
}
