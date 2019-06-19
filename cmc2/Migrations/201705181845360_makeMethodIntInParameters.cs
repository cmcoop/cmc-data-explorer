namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class makeMethodIntInParameters : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Parameters", "Method", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Parameters", "Method", c => c.String());
        }
    }
}
