namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateEventsUserIdtoString : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Events", new[] { "User_Id" });
            DropColumn("dbo.Events", "CreatedBy");
            RenameColumn(table: "dbo.Events", name: "User_Id", newName: "CreatedBy");
            AlterColumn("dbo.Events", "CreatedBy", c => c.String(maxLength: 128));
            CreateIndex("dbo.Events", "CreatedBy");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Events", new[] { "CreatedBy" });
            AlterColumn("dbo.Events", "CreatedBy", c => c.Int(nullable: false));
            RenameColumn(table: "dbo.Events", name: "CreatedBy", newName: "User_Id");
            AddColumn("dbo.Events", "CreatedBy", c => c.Int(nullable: false));
            CreateIndex("dbo.Events", "User_Id");
        }
    }
}
