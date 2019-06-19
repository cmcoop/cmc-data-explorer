namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addLab : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ParameterGroups", "ParameterId", "dbo.Parameters");
            AddColumn("dbo.ParameterGroups", "Parameter_Id", c => c.Int());
            AddColumn("dbo.ParameterGroups", "Lab_Id", c => c.Int());
            CreateIndex("dbo.ParameterGroups", "Parameter_Id");
            CreateIndex("dbo.ParameterGroups", "Lab_Id");
            AddForeignKey("dbo.ParameterGroups", "Lab_Id", "dbo.Parameters", "Id");
            AddForeignKey("dbo.ParameterGroups", "Parameter_Id", "dbo.Parameters", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ParameterGroups", "Parameter_Id", "dbo.Parameters");
            DropForeignKey("dbo.ParameterGroups", "Lab_Id", "dbo.Parameters");
            DropIndex("dbo.ParameterGroups", new[] { "Lab_Id" });
            DropIndex("dbo.ParameterGroups", new[] { "Parameter_Id" });
            DropColumn("dbo.ParameterGroups", "Lab_Id");
            DropColumn("dbo.ParameterGroups", "Parameter_Id");
            AddForeignKey("dbo.ParameterGroups", "ParameterId", "dbo.Parameters", "Id", cascadeDelete: true);
        }
    }
}
