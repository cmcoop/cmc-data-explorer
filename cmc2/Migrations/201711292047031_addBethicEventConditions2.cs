namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addBethicEventConditions2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BenthicEventConditions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        BenthicEventId = c.Int(nullable: false),
                        BenthicConditionId = c.Int(nullable: false),
                        Value = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.BenthicConditions", t => t.BenthicConditionId, cascadeDelete: true)
                .ForeignKey("dbo.BenthicEvents", t => t.BenthicEventId, cascadeDelete: true)
                .Index(t => new { t.BenthicEventId, t.BenthicConditionId }, unique: true, name: "IX_GroupParameter");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BenthicEventConditions", "BenthicEventId", "dbo.BenthicEvents");
            DropForeignKey("dbo.BenthicEventConditions", "BenthicConditionId", "dbo.BenthicConditions");
            DropIndex("dbo.BenthicEventConditions", "IX_GroupParameter");
            DropTable("dbo.BenthicEventConditions");
        }
    }
}
