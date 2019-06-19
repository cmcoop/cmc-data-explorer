namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addGroupIdToStation : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Events", "GroupId", "dbo.Groups");
            DropIndex("dbo.Events", new[] { "GroupId" });
            AddColumn("dbo.Stations", "GroupId", c => c.Int(nullable: false));
            CreateIndex("dbo.Stations", "GroupId");
            AddForeignKey("dbo.Stations", "GroupId", "dbo.Groups", "Id", cascadeDelete: true);
            DropColumn("dbo.Events", "GroupId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "GroupId", c => c.Int(nullable: false));
            DropForeignKey("dbo.Stations", "GroupId", "dbo.Groups");
            DropIndex("dbo.Stations", new[] { "GroupId" });
            DropColumn("dbo.Stations", "GroupId");
            CreateIndex("dbo.Events", "GroupId");
            AddForeignKey("dbo.Events", "GroupId", "dbo.Groups", "Id", cascadeDelete: true);
        }
    }
}
