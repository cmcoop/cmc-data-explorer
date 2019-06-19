namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class reviseBenthicSampleModel : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.BenthicSamples", "EventBenthicId", "dbo.Events");
            DropForeignKey("dbo.BenthicSamples", "ParameterBenthicId", "dbo.Parameters");
            DropIndex("dbo.BenthicSamples", new[] { "EventBenthicId" });
            DropIndex("dbo.BenthicSamples", new[] { "ParameterBenthicId" });
            AddColumn("dbo.BenthicSamples", "BenthicEventId", c => c.Int(nullable: false));
            AddColumn("dbo.BenthicSamples", "BenthicParameterId", c => c.Int(nullable: false));
            CreateIndex("dbo.BenthicSamples", "BenthicEventId");
            CreateIndex("dbo.BenthicSamples", "BenthicParameterId");
            AddForeignKey("dbo.BenthicSamples", "BenthicEventId", "dbo.BenthicEvents", "Id", cascadeDelete: true);
            AddForeignKey("dbo.BenthicSamples", "BenthicParameterId", "dbo.BenthicParameters", "Id", cascadeDelete: true);
            DropColumn("dbo.BenthicSamples", "EventBenthicId");
            DropColumn("dbo.BenthicSamples", "ParameterBenthicId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.BenthicSamples", "ParameterBenthicId", c => c.Int(nullable: false));
            AddColumn("dbo.BenthicSamples", "EventBenthicId", c => c.Int(nullable: false));
            DropForeignKey("dbo.BenthicSamples", "BenthicParameterId", "dbo.BenthicParameters");
            DropForeignKey("dbo.BenthicSamples", "BenthicEventId", "dbo.BenthicEvents");
            DropIndex("dbo.BenthicSamples", new[] { "BenthicParameterId" });
            DropIndex("dbo.BenthicSamples", new[] { "BenthicEventId" });
            DropColumn("dbo.BenthicSamples", "BenthicParameterId");
            DropColumn("dbo.BenthicSamples", "BenthicEventId");
            CreateIndex("dbo.BenthicSamples", "ParameterBenthicId");
            CreateIndex("dbo.BenthicSamples", "EventBenthicId");
            AddForeignKey("dbo.BenthicSamples", "ParameterBenthicId", "dbo.Parameters", "Id", cascadeDelete: true);
            AddForeignKey("dbo.BenthicSamples", "EventBenthicId", "dbo.Events", "Id", cascadeDelete: true);
        }
    }
}
