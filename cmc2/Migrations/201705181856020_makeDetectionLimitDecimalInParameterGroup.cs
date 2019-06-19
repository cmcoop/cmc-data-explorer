namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeDetectionLimitDecimalInParameterGroup : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ParameterGroups", "DetectionLimit", c => c.Decimal(precision: 16, scale: 10));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ParameterGroups", "DetectionLimit", c => c.String());
        }
    }
}
