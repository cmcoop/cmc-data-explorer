namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addSamplingMethodToStation : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.StationSamplingMethods",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Order = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Stations", "StationSamplingMethodId", c => c.Int());
            CreateIndex("dbo.Stations", "StationSamplingMethodId");
            AddForeignKey("dbo.Stations", "StationSamplingMethodId", "dbo.StationSamplingMethods", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Stations", "StationSamplingMethodId", "dbo.StationSamplingMethods");
            DropIndex("dbo.Stations", new[] { "StationSamplingMethodId" });
            DropColumn("dbo.Stations", "StationSamplingMethodId");
            DropTable("dbo.StationSamplingMethods");
        }
    }
}
