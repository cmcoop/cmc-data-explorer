namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class limitCharLengthLabCode : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Labs", new[] { "Code" });
            AlterColumn("dbo.Labs", "Code", c => c.String(nullable: false, maxLength: 10));
            CreateIndex("dbo.Labs", "Code", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("dbo.Labs", new[] { "Code" });
            AlterColumn("dbo.Labs", "Code", c => c.String(nullable: false, maxLength: 450));
            CreateIndex("dbo.Labs", "Code", unique: true);
        }
    }
}
