namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateEventsAndAddConditionTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Conditions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Events", "GroupId", c => c.Int(nullable: false));
            AddColumn("dbo.Events", "CreatedBy", c => c.Int(nullable: false));
            AddColumn("dbo.Events", "User_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.Events", "GroupId");
            CreateIndex("dbo.Events", "User_Id");
            AddForeignKey("dbo.Events", "GroupId", "dbo.Groups", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Events", "User_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Events", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Events", "GroupId", "dbo.Groups");
            DropIndex("dbo.Events", new[] { "User_Id" });
            DropIndex("dbo.Events", new[] { "GroupId" });
            DropColumn("dbo.Events", "User_Id");
            DropColumn("dbo.Events", "CreatedBy");
            DropColumn("dbo.Events", "GroupId");
            DropTable("dbo.Conditions");
        }
    }
}
