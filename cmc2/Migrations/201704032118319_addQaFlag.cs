namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addQaFlag : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.QaFlags",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Description = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Samples", "QaFlagId", c => c.Int(nullable: false));
            CreateIndex("dbo.Samples", "QaFlagId");
            AddForeignKey("dbo.Samples", "QaFlagId", "dbo.QaFlags", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Samples", "QaFlagId", "dbo.QaFlags");
            DropIndex("dbo.Samples", new[] { "QaFlagId" });
            DropColumn("dbo.Samples", "QaFlagId");
            DropTable("dbo.QaFlags");
        }
    }
}
