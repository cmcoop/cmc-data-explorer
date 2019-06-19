namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addRelatedParametersToSupportCalibration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.RelatedParameters",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CalibrationParameter_Id = c.Int(),
                        WqParameter_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Parameters", t => t.CalibrationParameter_Id)
                .ForeignKey("dbo.Parameters", t => t.WqParameter_Id)
                .Index(t => t.CalibrationParameter_Id)
                .Index(t => t.WqParameter_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.RelatedParameters", "WqParameter_Id", "dbo.Parameters");
            DropForeignKey("dbo.RelatedParameters", "CalibrationParameter_Id", "dbo.Parameters");
            DropIndex("dbo.RelatedParameters", new[] { "WqParameter_Id" });
            DropIndex("dbo.RelatedParameters", new[] { "CalibrationParameter_Id" });
            DropTable("dbo.RelatedParameters");
        }
    }
}
