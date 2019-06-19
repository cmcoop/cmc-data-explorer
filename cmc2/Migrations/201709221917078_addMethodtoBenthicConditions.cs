namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addMethodtoBenthicConditions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicConditionCategories", "Method", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.BenthicConditionCategories", "Method");
        }
    }
}
