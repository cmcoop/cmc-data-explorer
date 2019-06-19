namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addOrdertoBenthicParameters : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicParameters", "allarmOrder", c => c.Int(nullable: false));
            AddColumn("dbo.BenthicParameters", "iwlOrder", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BenthicParameters", "iwlOrder");
            DropColumn("dbo.BenthicParameters", "allarmOrder");
        }
    }
}
