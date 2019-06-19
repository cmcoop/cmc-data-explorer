namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addBottomTypeToBenthicParameter : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BenthicParameters", "BottomType", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.BenthicParameters", "BottomType");
        }
    }
}
