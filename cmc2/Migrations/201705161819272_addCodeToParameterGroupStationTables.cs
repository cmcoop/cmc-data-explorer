namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCodeToParameterGroupStationTables : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "Code", c => c.String(nullable: false));
            AddColumn("dbo.Parameters", "Code", c => c.String(nullable: false));
            AddColumn("dbo.Stations", "Code", c => c.String(nullable: false));
            AlterColumn("dbo.Groups", "Name", c => c.String());
            AlterColumn("dbo.Parameters", "Name", c => c.String());
            AlterColumn("dbo.Stations", "Name", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Stations", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.Parameters", "Name", c => c.String(nullable: false));
            AlterColumn("dbo.Groups", "Name", c => c.String(nullable: false));
            DropColumn("dbo.Stations", "Code");
            DropColumn("dbo.Parameters", "Code");
            DropColumn("dbo.Groups", "Code");
        }
    }
}
