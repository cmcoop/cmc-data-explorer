namespace cmc2.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class expandStationAndAddStationGroupRelationship : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Stations", "GroupId", "dbo.Groups");
            DropIndex("dbo.Stations", new[] { "GroupId" });
            CreateTable(
                "dbo.StationGroups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GroupId = c.Int(nullable: false),
                        StationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.GroupId, cascadeDelete: true)
                .ForeignKey("dbo.Stations", t => t.StationId, cascadeDelete: true)
                .Index(t => new { t.GroupId, t.StationId }, unique: true, name: "IX_GroupParameter");
            
            AddColumn("dbo.Stations", "Description", c => c.String());
            AddColumn("dbo.Stations", "Datum", c => c.String());
            AddColumn("dbo.Stations", "CityCounty", c => c.String());
            AddColumn("dbo.Stations", "Tidal", c => c.Boolean(nullable: false));
            AddColumn("dbo.Stations", "Comments", c => c.String());
            DropColumn("dbo.Stations", "GroupId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Stations", "GroupId", c => c.Int(nullable: false));
            DropForeignKey("dbo.StationGroups", "StationId", "dbo.Stations");
            DropForeignKey("dbo.StationGroups", "GroupId", "dbo.Groups");
            DropIndex("dbo.StationGroups", "IX_GroupParameter");
            DropColumn("dbo.Stations", "Comments");
            DropColumn("dbo.Stations", "Tidal");
            DropColumn("dbo.Stations", "CityCounty");
            DropColumn("dbo.Stations", "Datum");
            DropColumn("dbo.Stations", "Description");
            DropTable("dbo.StationGroups");
            CreateIndex("dbo.Stations", "GroupId");
            AddForeignKey("dbo.Stations", "GroupId", "dbo.Groups", "Id", cascadeDelete: true);
        }
    }
}
