namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeCodesUnique : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Conditions", "Code", c => c.String(nullable: false, maxLength: 450));
            AlterColumn("dbo.AspNetUsers", "Code", c => c.String(maxLength: 450));
            AlterColumn("dbo.Groups", "Code", c => c.String(nullable: false, maxLength: 450));
            AlterColumn("dbo.Labs", "Code", c => c.String(nullable: false, maxLength: 450));
            AlterColumn("dbo.Parameters", "Code", c => c.String(nullable: false, maxLength: 450));
            AlterColumn("dbo.Stations", "Code", c => c.String(nullable: false, maxLength: 450));
            CreateIndex("dbo.Conditions", "Code", unique: true);
            CreateIndex("dbo.AspNetUsers", "Code", unique: true);
            CreateIndex("dbo.Groups", "Code", unique: true);
            CreateIndex("dbo.Labs", "Code", unique: true);
            CreateIndex("dbo.Parameters", "Code", unique: true);
            CreateIndex("dbo.Stations", "Code", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("dbo.Stations", new[] { "Code" });
            DropIndex("dbo.Parameters", new[] { "Code" });
            DropIndex("dbo.Labs", new[] { "Code" });
            DropIndex("dbo.Groups", new[] { "Code" });
            DropIndex("dbo.AspNetUsers", new[] { "Code" });
            DropIndex("dbo.Conditions", new[] { "Code" });
            AlterColumn("dbo.Stations", "Code", c => c.String(nullable: false));
            AlterColumn("dbo.Parameters", "Code", c => c.String(nullable: false));
            AlterColumn("dbo.Labs", "Code", c => c.String());
            AlterColumn("dbo.Groups", "Code", c => c.String(nullable: false));
            AlterColumn("dbo.AspNetUsers", "Code", c => c.String());
            AlterColumn("dbo.Conditions", "Code", c => c.String(nullable: false));
        }
    }
}
