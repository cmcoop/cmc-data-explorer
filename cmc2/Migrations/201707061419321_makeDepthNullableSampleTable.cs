namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeDepthNullableSampleTable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Samples", "Depth", c => c.Decimal(precision: 16, scale: 10));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Samples", "Depth", c => c.Decimal(nullable: false, precision: 16, scale: 10));
        }
    }
}
