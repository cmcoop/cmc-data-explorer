namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addRequiresSampleDepthToParametersAndisCategoricaltoConditions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Conditions", "isCategorical", c => c.Boolean(nullable: false));
            AddColumn("dbo.Parameters", "requiresSampleDepth", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "requiresSampleDepth");
            DropColumn("dbo.Conditions", "isCategorical");
        }
    }
}
