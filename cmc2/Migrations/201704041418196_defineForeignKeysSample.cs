namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class defineForeignKeysSample : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Samples", "QualiferId");
            RenameColumn(table: "dbo.Samples", name: "Qualifier_Id", newName: "QualiferId");
            RenameIndex(table: "dbo.Samples", name: "IX_Qualifier_Id", newName: "IX_QualiferId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.Samples", name: "IX_QualiferId", newName: "IX_Qualifier_Id");
            RenameColumn(table: "dbo.Samples", name: "QualiferId", newName: "Qualifier_Id");
            AddColumn("dbo.Samples", "QualiferId", c => c.Int());
        }
    }
}
