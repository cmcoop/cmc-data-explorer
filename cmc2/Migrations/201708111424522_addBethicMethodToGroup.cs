namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addBethicMethodToGroup : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "BenthicMethod", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Groups", "BenthicMethod");
        }
    }
}
