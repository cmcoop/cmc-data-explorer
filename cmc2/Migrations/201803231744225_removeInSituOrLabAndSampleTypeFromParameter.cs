namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeInSituOrLabAndSampleTypeFromParameter : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Parameters", "SampleType");
            DropColumn("dbo.Parameters", "InSituOrLab");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Parameters", "InSituOrLab", c => c.String());
            AddColumn("dbo.Parameters", "SampleType", c => c.String());
        }
    }
}
