namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeParameterTierAString : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Parameters", "Tier", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Parameters", "Tier", c => c.Int());
        }
    }
}
