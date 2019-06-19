namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addIsCalibrationParameterToParameters : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Parameters", "isCalibrationParameter", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "isCalibrationParameter");
        }
    }
}
