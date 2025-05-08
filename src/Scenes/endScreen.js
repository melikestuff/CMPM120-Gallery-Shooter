
class EndScreen extends Phaser.Scene {
    constructor() {
        super("EndScreen");

        //width: 800,
        //height: 600,
    }

    init(data) {
        // This gets called before preload/create
        this.finalScore = data.finalScore;
        this.remainingHP = data.remainingHP;
        this.beatLevelOne = data.completion;
        console.log("Received score:", this.finalScore);
    }
    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        
    }

    create() {
        console.log("End screen started");
        if(this.remainingHP > 0){
            this.add.text(300, 50, `You Win! ${this.remainingHP}`, { fontSize: '48px', fill: '#fff' });
        } else{
            this.add.text(250, 50, `You Lost :(`, { fontSize: '48px', fill: '#fff' });
        }
        this.add.text(50, 175, `Final Score: ${this.finalScore}`, { fontSize: '48px', fill: '#fff' });
        this.add.text(50, 275, `Remaining HP: ${this.remainingHP}`, { fontSize: '48px', fill: '#fff' });

        const button = this.add.text(250, 500, "Back to Main Menu", {
            fontSize: "28px",
            fill: "#00ff00",
            backgroundColor: "#000",
            padding: { x: 10, y: 5 }
        });

        // Make it interactive
        button.setInteractive({ useHandCursor: true });

        // Hover effects
        button.on("pointerover", () => button.setStyle({ fill: "#ffff00" }));
        button.on("pointerout", () => button.setStyle({ fill: "#00ff00" }));

        // Click handler
        button.on("pointerdown", () => {
            this.scene.start("StartMenu", {completion: this.beatLevelOne});
        });
    }

    update() {

    }
}
