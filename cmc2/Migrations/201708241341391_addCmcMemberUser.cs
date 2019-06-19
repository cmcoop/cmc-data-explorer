namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCmcMemberUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "CmcMember", c => c.String(maxLength: 128));
            CreateIndex("dbo.Groups", "CmcMember");
            AddForeignKey("dbo.Groups", "CmcMember", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Groups", "CmcMember", "dbo.AspNetUsers");
            DropIndex("dbo.Groups", new[] { "CmcMember" });
            DropColumn("dbo.Groups", "CmcMember");
        }
    }
}
