namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addStateToStationModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stations", "State", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stations", "State");
        }
    }
}
