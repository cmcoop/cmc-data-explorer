namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addQualifier : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Qualifiers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Samples", "QualiferId", c => c.Int(nullable: false));
            AddColumn("dbo.Samples", "Qualifier_Id", c => c.Int());
            CreateIndex("dbo.Samples", "Qualifier_Id");
            AddForeignKey("dbo.Samples", "Qualifier_Id", "dbo.Qualifiers", "Id");
            DropColumn("dbo.Samples", "Qualifier");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Samples", "Qualifier", c => c.String());
            DropForeignKey("dbo.Samples", "Qualifier_Id", "dbo.Qualifiers");
            DropIndex("dbo.Samples", new[] { "Qualifier_Id" });
            DropColumn("dbo.Samples", "Qualifier_Id");
            DropColumn("dbo.Samples", "QualiferId");
            DropTable("dbo.Qualifiers");
        }
    }
}
