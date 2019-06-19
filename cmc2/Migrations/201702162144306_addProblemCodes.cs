namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addProblemCodes : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Problems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Samples", "ProblemId", c => c.Int(nullable: false));
            CreateIndex("dbo.Samples", "ProblemId");
            AddForeignKey("dbo.Samples", "ProblemId", "dbo.Problems", "Id", cascadeDelete: true);
            DropColumn("dbo.Samples", "Problem");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Samples", "Problem", c => c.String());
            DropForeignKey("dbo.Samples", "ProblemId", "dbo.Problems");
            DropIndex("dbo.Samples", new[] { "ProblemId" });
            DropColumn("dbo.Samples", "ProblemId");
            DropTable("dbo.Problems");
        }
    }
}
