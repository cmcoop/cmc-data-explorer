namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addNullableQualifierAndProblemIds : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Samples", "ProblemId", "dbo.Problems");
            DropIndex("dbo.Samples", new[] { "ProblemId" });
            AlterColumn("dbo.Samples", "ProblemId", c => c.Int());
            AlterColumn("dbo.Samples", "QualiferId", c => c.Int());
            CreateIndex("dbo.Samples", "ProblemId");
            AddForeignKey("dbo.Samples", "ProblemId", "dbo.Problems", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Samples", "ProblemId", "dbo.Problems");
            DropIndex("dbo.Samples", new[] { "ProblemId" });
            AlterColumn("dbo.Samples", "QualiferId", c => c.Int(nullable: false));
            AlterColumn("dbo.Samples", "ProblemId", c => c.Int(nullable: false));
            CreateIndex("dbo.Samples", "ProblemId");
            AddForeignKey("dbo.Samples", "ProblemId", "dbo.Problems", "Id", cascadeDelete: true);
        }
    }
}
