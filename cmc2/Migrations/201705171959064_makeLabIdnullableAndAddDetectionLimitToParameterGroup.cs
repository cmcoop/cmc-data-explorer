namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeLabIdnullableAndAddDetectionLimitToParameterGroup : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ParameterGroups", "LabId", "dbo.Labs");
            DropIndex("dbo.ParameterGroups", new[] { "LabId" });
            AddColumn("dbo.ParameterGroups", "DetectionLimit", c => c.String());
            AlterColumn("dbo.ParameterGroups", "LabId", c => c.Int());
            CreateIndex("dbo.ParameterGroups", "LabId");
            AddForeignKey("dbo.ParameterGroups", "LabId", "dbo.Labs", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ParameterGroups", "LabId", "dbo.Labs");
            DropIndex("dbo.ParameterGroups", new[] { "LabId" });
            AlterColumn("dbo.ParameterGroups", "LabId", c => c.Int(nullable: false));
            DropColumn("dbo.ParameterGroups", "DetectionLimit");
            CreateIndex("dbo.ParameterGroups", "LabId");
            AddForeignKey("dbo.ParameterGroups", "LabId", "dbo.Labs", "Id", cascadeDelete: true);
        }
    }
}
