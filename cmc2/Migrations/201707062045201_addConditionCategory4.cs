namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addConditionCategory4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ConditionCategories", "Order", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ConditionCategories", "Order");
        }
    }
}
