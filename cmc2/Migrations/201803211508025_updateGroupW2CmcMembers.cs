namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateGroupW2CmcMembers : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "CmcMember2", c => c.String(maxLength: 128));
            AddColumn("dbo.Groups", "CmcMember3", c => c.String(maxLength: 128));
            CreateIndex("dbo.Groups", "CmcMember2");
            CreateIndex("dbo.Groups", "CmcMember3");
            AddForeignKey("dbo.Groups", "CmcMember2", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Groups", "CmcMember3", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Groups", "CmcMember3", "dbo.AspNetUsers");
            DropForeignKey("dbo.Groups", "CmcMember2", "dbo.AspNetUsers");
            DropIndex("dbo.Groups", new[] { "CmcMember3" });
            DropIndex("dbo.Groups", new[] { "CmcMember2" });
            DropColumn("dbo.Groups", "CmcMember3");
            DropColumn("dbo.Groups", "CmcMember2");
        }
    }
}
