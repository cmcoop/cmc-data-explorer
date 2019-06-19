namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCmcQappBoolToGroup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "cmcQapp", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Groups", "cmcQapp");
        }
    }
}
