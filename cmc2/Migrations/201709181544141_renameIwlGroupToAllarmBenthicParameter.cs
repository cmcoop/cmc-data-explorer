namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class renameIwlGroupToAllarmBenthicParameter : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicParameters", "allarmGroup", c => c.Int(nullable: false));
            DropColumn("dbo.BenthicParameters", "iwlGroup");
        }
        
        public override void Down()
        {
            AddColumn("dbo.BenthicParameters", "iwlGroup", c => c.Int(nullable: false));
            DropColumn("dbo.BenthicParameters", "allarmGroup");
        }
    }
}
