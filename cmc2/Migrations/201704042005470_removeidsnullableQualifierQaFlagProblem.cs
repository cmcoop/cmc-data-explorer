namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class removeidsnullableQualifierQaFlagProblem : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Samples", name: "QualiferId", newName: "QualifierId");
            RenameIndex(table: "dbo.Samples", name: "IX_QualiferId", newName: "IX_QualifierId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.Samples", name: "IX_QualifierId", newName: "IX_QualiferId");
            RenameColumn(table: "dbo.Samples", name: "QualifierId", newName: "QualiferId");
        }
    }
}
