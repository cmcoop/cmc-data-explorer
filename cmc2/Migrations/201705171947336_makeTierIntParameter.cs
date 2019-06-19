namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeTierIntParameter : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Parameters", "Tier", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Parameters", "Tier", c => c.String());
        }
    }
}
