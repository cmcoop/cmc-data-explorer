namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCreatedAndModifiedByToStation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stations", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Stations", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Stations", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Stations", "ModifiedDate", c => c.DateTime(nullable: false));
            CreateIndex("dbo.Stations", "CreatedBy");
            CreateIndex("dbo.Stations", "ModifiedBy");
            AddForeignKey("dbo.Stations", "CreatedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Stations", "ModifiedBy", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Stations", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.Stations", "CreatedBy", "dbo.AspNetUsers");
            DropIndex("dbo.Stations", new[] { "ModifiedBy" });
            DropIndex("dbo.Stations", new[] { "CreatedBy" });
            DropColumn("dbo.Stations", "ModifiedDate");
            DropColumn("dbo.Stations", "ModifiedBy");
            DropColumn("dbo.Stations", "CreatedDate");
            DropColumn("dbo.Stations", "CreatedBy");
        }
    }
}
