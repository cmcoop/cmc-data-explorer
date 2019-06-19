namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class renameColumnsRelatedParameters : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.RelatedParameters", name: "CalibrationParameter_Id", newName: "CalibrationParameterId");
            RenameColumn(table: "dbo.RelatedParameters", name: "WqParameter_Id", newName: "WqParameterId");
            RenameIndex(table: "dbo.RelatedParameters", name: "IX_WqParameter_Id", newName: "IX_WqParameterId");
            RenameIndex(table: "dbo.RelatedParameters", name: "IX_CalibrationParameter_Id", newName: "IX_CalibrationParameterId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.RelatedParameters", name: "IX_CalibrationParameterId", newName: "IX_CalibrationParameter_Id");
            RenameIndex(table: "dbo.RelatedParameters", name: "IX_WqParameterId", newName: "IX_WqParameter_Id");
            RenameColumn(table: "dbo.RelatedParameters", name: "WqParameterId", newName: "WqParameter_Id");
            RenameColumn(table: "dbo.RelatedParameters", name: "CalibrationParameterId", newName: "CalibrationParameter_Id");
        }
    }
}
