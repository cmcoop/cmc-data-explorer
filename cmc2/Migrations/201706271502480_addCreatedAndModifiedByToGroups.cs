namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCreatedAndModifiedByToGroups : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Groups", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Groups", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Groups", "ModifiedDate", c => c.DateTime(nullable: false));
            CreateIndex("dbo.Groups", "CreatedBy");
            CreateIndex("dbo.Groups", "ModifiedBy");
            AddForeignKey("dbo.Groups", "CreatedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Groups", "ModifiedBy", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Groups", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.Groups", "CreatedBy", "dbo.AspNetUsers");
            DropIndex("dbo.Groups", new[] { "ModifiedBy" });
            DropIndex("dbo.Groups", new[] { "CreatedBy" });
            DropColumn("dbo.Groups", "ModifiedDate");
            DropColumn("dbo.Groups", "ModifiedBy");
            DropColumn("dbo.Groups", "CreatedDate");
            DropColumn("dbo.Groups", "CreatedBy");
        }
    }
}
