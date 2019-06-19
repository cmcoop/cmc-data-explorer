namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addUpperAndLowerNonfatalRangesToParameter : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Parameters", "NonfatalUpperRange", c => c.Decimal(precision: 16, scale: 10));
            AddColumn("dbo.Parameters", "NonfatalLowerRange", c => c.Decimal(precision: 16, scale: 10));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Parameters", "NonfatalLowerRange");
            DropColumn("dbo.Parameters", "NonfatalUpperRange");
        }
    }
}
