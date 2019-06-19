namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addSampleTypeToParameters : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Parameters", "SampleType", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "SampleType");
        }
    }
}
