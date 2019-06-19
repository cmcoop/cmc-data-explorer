namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class createdbyandmodifiedby : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Events", "ModifiedBy", c => c.String());
            AddColumn("dbo.Events", "ModifiedDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Events", "ModifiedDate");
            DropColumn("dbo.Events", "ModifiedBy");
            DropColumn("dbo.Events", "CreatedDate");
        }
    }
}
