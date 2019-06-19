namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addkeytoeventaddfieldstosample : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Samples", "CreatedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Samples", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Samples", "ModifiedBy", c => c.String(maxLength: 128));
            AddColumn("dbo.Samples", "ModifiedDate", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Events", "ModifiedBy", c => c.String(maxLength: 128));
            AlterColumn("dbo.Samples", "SampleId", c => c.Int(nullable: false));
            CreateIndex("dbo.Events", "ModifiedBy");
            CreateIndex("dbo.Samples", "CreatedBy");
            CreateIndex("dbo.Samples", "ModifiedBy");
            AddForeignKey("dbo.Events", "ModifiedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Samples", "CreatedBy", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Samples", "ModifiedBy", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Samples", "ModifiedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.Samples", "CreatedBy", "dbo.AspNetUsers");
            DropForeignKey("dbo.Events", "ModifiedBy", "dbo.AspNetUsers");
            DropIndex("dbo.Samples", new[] { "ModifiedBy" });
            DropIndex("dbo.Samples", new[] { "CreatedBy" });
            DropIndex("dbo.Events", new[] { "ModifiedBy" });
            AlterColumn("dbo.Samples", "SampleId", c => c.String());
            AlterColumn("dbo.Events", "ModifiedBy", c => c.String());
            DropColumn("dbo.Samples", "ModifiedDate");
            DropColumn("dbo.Samples", "ModifiedBy");
            DropColumn("dbo.Samples", "CreatedDate");
            DropColumn("dbo.Samples", "CreatedBy");
        }
    }
}
