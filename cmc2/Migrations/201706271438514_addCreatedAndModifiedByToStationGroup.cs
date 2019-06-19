namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCreatedAndModifiedByToStationGroup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.StationGroups", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.StationGroups", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.StationGroups", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.StationGroups", "ModifiedDate", c => c.DateTime(nullable: false));
            CreateIndex("dbo.StationGroups", "CreatedBy");
            CreateIndex("dbo.StationGroups", "ModifiedBy");
            AddForeignKey("dbo.StationGroups", "CreatedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.StationGroups", "ModifiedBy", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.StationGroups", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.StationGroups", "CreatedBy", "dbo.AspNetUsers");
            DropIndex("dbo.StationGroups", new[] { "ModifiedBy" });
            DropIndex("dbo.StationGroups", new[] { "CreatedBy" });
            DropColumn("dbo.StationGroups", "ModifiedDate");
            DropColumn("dbo.StationGroups", "ModifiedBy");
            DropColumn("dbo.StationGroups", "CreatedDate");
            DropColumn("dbo.StationGroups", "CreatedBy");
        }
    }
}
