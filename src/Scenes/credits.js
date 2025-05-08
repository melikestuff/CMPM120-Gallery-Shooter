
class CreditsScene extends Phaser.Scene {
    constructor() {
        super("CreditsScene");

        //width: 800,
        //height: 600,
    }

    init(data) {
        this.beatLevelOne = data.completion;
    }
    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("urbanTiles", "tilemap_packed.png");    // tile sheet
        this.load.tilemapTiledJSON("map", "Background.json");                   // Load JSON of tilemap
    }

    create() {

// Controls
document.getElementById('description').innerHTML = '<h2>Car Stampede</h2><br>S: Down // W: Up // Space: fire/emit // LMB1: Interact with button and UI'

//Add the tile map
    this.map = this.add.tilemap("map", 16, 16, 20, 20);
    this.tileset = this.map.addTilesetImage("Urban", "urbanTiles");

    this.ground = this.map.createLayer("Ground", this.tileset, 0, 0);
    this.misc = this.map.createLayer("Misc", this.tileset, 0, 0);

    this.ground.setScale(2.5,1.9);
    this.misc.setScale(2.5,1.9);

    this.add.text(350, 75, "Credits!", {
        font: 'bold 35px Arial',
        fill: "#ffffff"
    });

    this.add.text(200, 100, "\n\nBenjamin Nguyen\nJim Whitehead (Prof)\nKenny's assets", {
        font: 'bold 35px Arial',
        fill: "#ffffff"
    });

    const backButton = this.add.text(350, 500, "Back", {
        font: "bold 30px Arial",
        fill: "#000000",
        backgroundColor: "#ffffff",
        padding: { x: 10, y: 5 }
    });

    backButton.setInteractive({ useHandCursor: true });
    backButton.on("pointerdown", () => {
        this.scene.start("StartMenu");
    });
    }

    update() {

    }
}
