namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BenthicConditionsAndCategories : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BenthicConditionCategories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ConditionId = c.Int(nullable: false),
                        Category = c.String(),
                        CategoryText = c.String(),
                        Order = c.Int(nullable: false),
                        Comments = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.BenthicConditions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false, maxLength: 450),
                        Name = c.String(),
                        Description = c.String(),
                        isCategorical = c.Boolean(nullable: false),
                        Status = c.Boolean(nullable: false),
                        Order = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Code, unique: true);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.BenthicConditions", new[] { "Code" });
            DropTable("dbo.BenthicConditions");
            DropTable("dbo.BenthicConditionCategories");
        }
    }
}
