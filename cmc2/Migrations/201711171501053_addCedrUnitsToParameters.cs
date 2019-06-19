namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCedrUnitsToParameters : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Parameters", "CedrUnits", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "CedrUnits");
        }
    }
}
