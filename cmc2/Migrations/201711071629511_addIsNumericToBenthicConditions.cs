namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addIsNumericToBenthicConditions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicConditions", "isNumeric", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BenthicConditions", "isNumeric");
        }
    }
}
