namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addConditionCategory2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ConditionCategories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ConditionId = c.String(nullable: false),
                        Category = c.String(),
                        Comments = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ConditionCategories");
        }
    }
}
