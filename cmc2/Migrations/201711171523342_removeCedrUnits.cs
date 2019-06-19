namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeCedrUnits : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Parameters", "CedrUnits");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Parameters", "CedrUnits", c => c.String());
        }
    }
}
