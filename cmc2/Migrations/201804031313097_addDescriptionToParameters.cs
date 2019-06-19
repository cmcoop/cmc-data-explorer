namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addDescriptionToParameters : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Parameters", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "Description");
        }
    }
}
