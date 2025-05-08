
class StartMenu extends Phaser.Scene {
    constructor() {
        super("StartMenu");

        //width: 800,
        //height: 600,
    }

    init(data) {

    }
    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("urbanTiles", "tilemap_packed.png");    // tile sheet
        this.load.tilemapTiledJSON("map", "Background.json");                   // Load JSON of tilemap
    }

    create() {
//Add the tile map
    this.map = this.add.tilemap("map", 16, 16, 20, 20);
    this.tileset = this.map.addTilesetImage("Urban", "urbanTiles");

    this.ground = this.map.createLayer("Ground", this.tileset, 0, 0);
    this.misc = this.map.createLayer("Misc", this.tileset, 0, 0);

    this.ground.setScale(2.5,1.9);
    this.misc.setScale(2.5,1.9);

//Add title
        this.add.text(250, 75, `Car Stampede`, { fill: '#f0ff39', font: 'bold 40px Arial'});

//Enter level
        const button = this.add.text(100, 200, "Play", {
            font: 'bold 35px Arial',
            fill: "#000000",
            backgroundColor: "#ffffff",
            
            padding: { x: 10, y: 5 }
        });

        // Make it interactive
        button.setInteractive({ useHandCursor: true });

        // Hover effects
        button.on("pointerover", () => button.setStyle({ fill: "#ffff00" }));
        button.on("pointerout", () => button.setStyle({ fill: "#00ff00" }));

        // Click handler
        button.on("pointerdown", () => {
            this.scene.start("gameplayScene");
        });

//Credits and controls button
        const buttonCC = this.add.text(100, 350, "Credits and Controls", {
            font: 'bold 35px Arial',
            fill: "#000000",
            backgroundColor: "#ffffff",
            padding: { x: 10, y: 5 }
        });

        // Make it interactive
        buttonCC.setInteractive({ useHandCursor: true });

        // Hover effects
        buttonCC.on("pointerover", () => buttonCC.setStyle({ fill: "#ffff00" }));
        buttonCC.on("pointerout", () => buttonCC.setStyle({ fill: "#00ff00" }));

        // Click handler
        buttonCC.on("pointerdown", () => {
            this.scene.start("CreditsScene");
        });
    }


    update() {

    }
}
