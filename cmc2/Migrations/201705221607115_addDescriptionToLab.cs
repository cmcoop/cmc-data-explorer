namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addDescriptionToLab : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Labs", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Labs", "Description");
        }
    }
}
