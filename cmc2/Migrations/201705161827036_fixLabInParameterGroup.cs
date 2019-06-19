namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fixLabInParameterGroup : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ParameterGroups", "Parameter_Id", "dbo.Parameters");
            DropIndex("dbo.ParameterGroups", "IX_GroupParameter");
            DropIndex("dbo.ParameterGroups", new[] { "Parameter_Id" });
            DropColumn("dbo.ParameterGroups", "ParameterId");
            RenameColumn(table: "dbo.ParameterGroups", name: "Parameter_Id", newName: "ParameterId");
            CreateTable(
                "dbo.Labs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Code = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AlterColumn("dbo.ParameterGroups", "ParameterId", c => c.Int(nullable: false));
            CreateIndex("dbo.ParameterGroups", new[] { "GroupId", "ParameterId" }, unique: true, name: "IX_GroupParameter");
            AddForeignKey("dbo.ParameterGroups", "ParameterId", "dbo.Parameters", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ParameterGroups", "ParameterId", "dbo.Parameters");
            DropIndex("dbo.ParameterGroups", "IX_GroupParameter");
            AlterColumn("dbo.ParameterGroups", "ParameterId", c => c.Int());
            DropTable("dbo.Labs");
            RenameColumn(table: "dbo.ParameterGroups", name: "ParameterId", newName: "Parameter_Id");
            AddColumn("dbo.ParameterGroups", "ParameterId", c => c.Int(nullable: false));
            CreateIndex("dbo.ParameterGroups", "Parameter_Id");
            CreateIndex("dbo.ParameterGroups", new[] { "GroupId", "ParameterId" }, unique: true, name: "IX_GroupParameter");
            AddForeignKey("dbo.ParameterGroups", "Parameter_Id", "dbo.Parameters", "Id");
        }
    }
}
