namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCreatedModifiedToLab : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Labs", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Labs", "ModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Labs", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Labs", "CreatedDate", c => c.DateTime(nullable: false));
            CreateIndex("dbo.Labs", "ModifiedBy");
            CreateIndex("dbo.Labs", "CreatedBy");
            AddForeignKey("dbo.Labs", "CreatedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Labs", "ModifiedBy", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Labs", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.Labs", "CreatedBy", "dbo.AspNetUsers");
            DropIndex("dbo.Labs", new[] { "CreatedBy" });
            DropIndex("dbo.Labs", new[] { "ModifiedBy" });
            DropColumn("dbo.Labs", "CreatedDate");
            DropColumn("dbo.Labs", "CreatedBy");
            DropColumn("dbo.Labs", "ModifiedDate");
            DropColumn("dbo.Labs", "ModifiedBy");
        }
    }
}
