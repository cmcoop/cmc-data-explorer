namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class conditionIdtoIntConditionCategory : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ConditionCategories", "ConditionId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ConditionCategories", "ConditionId", c => c.String(nullable: false));
        }
    }
}
