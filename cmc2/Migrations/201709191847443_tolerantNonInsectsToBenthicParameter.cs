namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tolerantNonInsectsToBenthicParameter : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicParameters", "tolerant", c => c.Boolean(nullable: false));
            AddColumn("dbo.BenthicParameters", "nonInsects", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BenthicParameters", "nonInsects");
            DropColumn("dbo.BenthicParameters", "tolerant");
        }
    }
}
