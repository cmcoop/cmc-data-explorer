namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserCode : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Code", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "Code");
        }
    }
}
