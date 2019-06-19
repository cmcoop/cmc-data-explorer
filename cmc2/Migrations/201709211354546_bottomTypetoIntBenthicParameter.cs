namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bottomTypetoIntBenthicParameter : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.BenthicParameters", "BottomType", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.BenthicParameters", "BottomType", c => c.String());
        }
    }
}
