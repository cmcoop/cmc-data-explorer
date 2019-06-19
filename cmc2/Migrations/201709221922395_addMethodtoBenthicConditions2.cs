namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addMethodtoBenthicConditions2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicConditions", "Method", c => c.String());
            DropColumn("dbo.BenthicConditionCategories", "Method");
        }
        
        public override void Down()
        {
            AddColumn("dbo.BenthicConditionCategories", "Method", c => c.String());
            DropColumn("dbo.BenthicConditions", "Method");
        }
    }
}
