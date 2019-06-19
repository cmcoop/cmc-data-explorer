namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addOrderToConditions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Conditions", "Order", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Conditions", "Order");
        }
    }
}
