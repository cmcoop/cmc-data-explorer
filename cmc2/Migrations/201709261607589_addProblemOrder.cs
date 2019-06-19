namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addProblemOrder : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Problems", "Order", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Problems", "Order");
        }
    }
}
