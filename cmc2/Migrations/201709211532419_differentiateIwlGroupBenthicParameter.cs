namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class differentiateIwlGroupBenthicParameter : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicParameters", "iwlRockyGroup", c => c.Int(nullable: false));
            AddColumn("dbo.BenthicParameters", "iwlMuddyGroup", c => c.Int(nullable: false));
            DropColumn("dbo.BenthicParameters", "iwlGroup");
        }
        
        public override void Down()
        {
            AddColumn("dbo.BenthicParameters", "iwlGroup", c => c.Int(nullable: false));
            DropColumn("dbo.BenthicParameters", "iwlMuddyGroup");
            DropColumn("dbo.BenthicParameters", "iwlRockyGroup");
        }
    }
}
