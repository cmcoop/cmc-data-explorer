namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCreatedAndModifiedByToUsers : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "CreatedBy", c => c.String());
            AddColumn("dbo.AspNetUsers", "CreatedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.AspNetUsers", "ModifiedBy", c => c.String());
            AddColumn("dbo.AspNetUsers", "ModifiedDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "ModifiedDate");
            DropColumn("dbo.AspNetUsers", "ModifiedBy");
            DropColumn("dbo.AspNetUsers", "CreatedDate");
            DropColumn("dbo.AspNetUsers", "CreatedBy");
        }
    }
}
