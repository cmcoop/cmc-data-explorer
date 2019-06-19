namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addProblemApplicationText : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Problems", "ApplicationText", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Problems", "ApplicationText");
        }
    }
}
