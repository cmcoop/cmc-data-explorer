namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tidalNontidalToBoolInParameters : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Parameters", "Tidal", c => c.Boolean());
            AlterColumn("dbo.Parameters", "NonTidal", c => c.Boolean());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Parameters", "NonTidal", c => c.String());
            AlterColumn("dbo.Parameters", "Tidal", c => c.String());
        }
    }
}
