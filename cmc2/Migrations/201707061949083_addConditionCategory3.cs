namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addConditionCategory3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ConditionCategories", "CategoryText", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ConditionCategories", "CategoryText");
        }
    }
}
