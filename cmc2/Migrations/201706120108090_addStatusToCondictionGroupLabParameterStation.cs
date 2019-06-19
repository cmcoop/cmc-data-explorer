namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addStatusToCondictionGroupLabParameterStation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Conditions", "Status", c => c.Boolean(nullable: false));
            AddColumn("dbo.Groups", "Status", c => c.Boolean(nullable: false));
            AddColumn("dbo.Labs", "Status", c => c.Boolean(nullable: false));
            AddColumn("dbo.Parameters", "Status", c => c.Boolean(nullable: false));
            AddColumn("dbo.Stations", "Status", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stations", "Status");
            DropColumn("dbo.Parameters", "Status");
            DropColumn("dbo.Labs", "Status");
            DropColumn("dbo.Groups", "Status");
            DropColumn("dbo.Conditions", "Status");
        }
    }
}
