namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addRequiresDuplicateToParameter : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Parameters", "requiresDuplicate", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "requiresDuplicate");
        }
    }
}
