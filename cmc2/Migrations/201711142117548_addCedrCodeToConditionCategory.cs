namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCedrCodeToConditionCategory : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ConditionCategories", "cedrCode", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ConditionCategories", "cedrCode");
        }
    }
}
