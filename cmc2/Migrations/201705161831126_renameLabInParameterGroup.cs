namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class renameLabInParameterGroup : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ParameterGroups", "Lab_Id", "dbo.Labs");
            DropIndex("dbo.ParameterGroups", new[] { "Lab_Id" });
            RenameColumn(table: "dbo.ParameterGroups", name: "Lab_Id", newName: "LabId");
            AlterColumn("dbo.ParameterGroups", "LabId", c => c.Int(nullable: false));
            CreateIndex("dbo.ParameterGroups", "LabId");
            AddForeignKey("dbo.ParameterGroups", "LabId", "dbo.Labs", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ParameterGroups", "LabId", "dbo.Labs");
            DropIndex("dbo.ParameterGroups", new[] { "LabId" });
            AlterColumn("dbo.ParameterGroups", "LabId", c => c.Int());
            RenameColumn(table: "dbo.ParameterGroups", name: "LabId", newName: "Lab_Id");
            CreateIndex("dbo.ParameterGroups", "Lab_Id");
            AddForeignKey("dbo.ParameterGroups", "Lab_Id", "dbo.Labs", "Id");
        }
    }
}
