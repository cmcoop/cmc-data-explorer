namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addHuc8NameToStations : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stations", "Huc8Name", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stations", "Huc8Name");
        }
    }
}
