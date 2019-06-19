namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCoordinatorCanPublishToGroup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "coordinatorCanPublish", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Groups", "coordinatorCanPublish");
        }
    }
}
