namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addHuc6NameToStations : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stations", "Huc6Name", c => c.String());
            DropColumn("dbo.Stations", "Huc8Name");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Stations", "Huc8Name", c => c.String());
            DropColumn("dbo.Stations", "Huc6Name");
        }
    }
}
