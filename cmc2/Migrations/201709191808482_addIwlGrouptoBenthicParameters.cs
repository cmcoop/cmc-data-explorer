namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addIwlGrouptoBenthicParameters : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicParameters", "iwlGroup", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BenthicParameters", "iwlGroup");
        }
    }
}
