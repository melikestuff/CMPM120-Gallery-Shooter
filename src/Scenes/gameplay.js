
const playerSpeed = 200; //pixels per second
let maxHP = 3; //Starting health of player
let currHP = maxHP;
let elaspedTime = 0;
let surviveFor = 60;
let spawnTime = 3;
let currSpawnTime = spawnTime;

let score = 0;

class gameplay extends Phaser.Scene {
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    playerDamaged(){
        currHP--;
        console.log("Got hit, HP is now " + currHP);
        if (currHP <= 0){
        //Call dead function here
        //console.log("Dead");
        this.endScene();
        }
    }

    endScene(){
        for (let i = 0; i <= currHP; i++){
            score= score + 1000;
        }
        this.scene.start("EndScreen", { finalScore: score, remainingHP: currHP });
    }
    //enemyCar
    //path 
    //enemycar 0 for small, 1 medium, 2 big
    //path index from top to bottom 0-4.
    spawnNewEnemy(pathIndex){
        let my = this.my;
        //let pathToFollow = this.curves[pathIndex];
        //const enemyType = this.enemyTypes[carType];
        //console.log(enemyType.name);
        //my.sprite.cars[0].x = this.points[pathIndex][0];
        //my.sprite.cars[0].y = this.points[pathIndex][1];
        //console.log(this.points[0]);
        //my.sprite.cars[0].visible = true;
        for (let car of my.sprite.cars){
            if(!car.visible){
                car.visible = true;
                car.health = this.maxCarsHealth;

                car.x = this.points[pathIndex][0];
                car.y = this.points[pathIndex][1];
                car.startFollow({
                    from: 0,
                    to: 1,
                    delay: 0,
                    duration: 12000,
                    repeat: false,
                    yoyo: true,
                    rotateToPath: true,
                    rotationOffset: 180
               });
                console.log("Should follow path now");
                break;
            }
        }
        //console.log("Could not spawn car due to too many cars!");
    }

    constructor() {
        super('gameplayScene');

        //width: 800,
        //height: 600,
        this.player = null;
        this.bullet = null;
        
        //Holds pointers to all bullets
        this.my = {sprite: {}}; 
        this.bulletCooldown = .5;        // Number of seconds to wait before making a new bullet
        this.bulletCooldownCounter = this.bulletCooldown;

        //Holds pointers to all enemies.
    

        this.my.sprite.bullet = []; // Create an object to hold sprite bindings for player
        this.maxBullets = 4;

        this.my.sprite.cars = []; // Create an object to hold sprite bindings for enemies
        this.maxCars = 10;
        this.maxCarsHealth = 2;

        this.my.sprite.enemyBullet = []; // Create an object to hold sprite bindings for enemy bullets
        this.maxEnemyBullets = 20;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        
        //console.log("preload works!");

        this.load.setPath("./assets/");
        //this.load.image("Name here", "File name);
        this.load.image("playerModel", "character_roundGreen.png");
        this.load.image("playerBullet", "character_handGreen.png");
        this.load.image("enemyBullet", "rounded_red.png");
        this.load.image("smallCar", "buggy.png");
        this.load.image("mediumCar", "rounded_red.png");
        this.load.image("BigCar", "truck.png");

        this.load.setPath("./assets/");
        this.load.image("urbanTiles", "tilemap_packed.png");    // tile sheet
        this.load.tilemapTiledJSON("map", "Background.json");                   // Load JSON of tilemap


        this.load.audio("clashSFX", "impactMetal_medium_000.ogg");

        console.log("preload Done!");
    }

    create() {
    let my = this.my;   // create an alias to this.my for readability

//Load in tilemap
    this.map = this.add.tilemap("map", 16, 16, 20, 20);
    this.tileset = this.map.addTilesetImage("Urban", "urbanTiles");

    this.ground = this.map.createLayer("Ground", this.tileset, 0, 0);
    this.misc = this.map.createLayer("Misc", this.tileset, 0, 0);

    this.ground.setScale(2.5,1.9);
    this.misc.setScale(2.5,1.9);

//HUD for score and health

    this.hudText = this.add.text(650, 0, `Score: ${score}`, {
            font: 'bold 35px Arial',
            backgroundColor: "#ffffff",
            fill: '#000000'
        });

    this.hudText = this.add.text(50, 550, `Lives: ${currHP}`, {
            font: 'bold 35px Arial',
            backgroundColor: "#ffffff",
            fill: '#000000'
        });

//Declare enemy types
/*
    this.enemyTypes = [
        {
            name: "smallCar",
            texture: "buggy.png",
            health: 1
        },
        {
            name: "mediumCar",
            texture: "rounded_red.png",
            health: 2
       },
       {
            name: "BigCar",
            texture: "truck.png",
            health: 4
        }
    ];
    */


        //Set up paths
//Paths for enemies
        this.points=[
            //Top path, 0
            [
                //Start of path
                850, 50,
                50, 50
            ],
            //Path 1
            [
                //Start of path
                850, 175,
                50, 175
            ],
            //Path 2
            [
                //Start of path
                850, 300,
                50, 300
            ],
            //Path 3
            [
                //Start of path
                850, 425,
                50, 425
            ],
            //Path 4
            [
                //Start of path
                850, 550,
                50, 550
            ]
        ];

    // Create an array to store all the curves
    this.paths = [];
    for (let i = 0; i < this.points.length; i += 1){
        this.paths[i] = new Phaser.Curves.Spline(this.points[i]);
        //console.log("Did line " + i);
    }
    console.log("Paths initlized");
    // Create a graphics object for drawing the curves
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x00ff00, 1); // Green lines

    // Draw each curve (For visual purposes)
    this.paths.forEach(curve => {
        curve.draw(graphics, 64);
    });

//Set some variables
    this.bulletSpeed = 12;
//Load and add sprites
    this.player = this.add.sprite(50, 300, "playerModel");

//Pre make all enemies
    for (let i=0; i < this.maxCars; i++) {
        // create a sprite which is offscreen and invisible
        //my.sprite.cars.push(this.add.sprite(-200, -200, "BigCar"));
        my.sprite.cars[i] = this.add.follower(this.paths[3], 10, 10, "BigCar");
        my.sprite.cars[i].visible = false;
        my.sprite.cars[i].health = this.maxCarsHealth; //Set hp of each car here using given variable from constructor
        my.sprite.cars[i].flipX = true;
        my.sprite.cars[i].setScale(1.5);
        //console.log(my.sprite.cars[i].health);
        console.log("Made a car");
    }
//Pre make all bullets
    for (let i=0; i < this.maxBullets; i++) {
        // create a sprite which is offscreen and invisible
        my.sprite.bullet.push(this.add.sprite(-100, -100, "playerBullet"));
        my.sprite.bullet[i].visible = false;
        console.log("Made a Player Bullet");
    }
//Pre make all enemy bullets
    for (let i=0; i < this.maxEnemyBullets; i++) {
        // create a sprite which is offscreen and invisible
        my.sprite.enemyBullet.push(this.add.sprite(-100, -100, "enemyBullet"));
        my.sprite.enemyBullet[i].visible = false;
        console.log("Made a Enemy Bullet");
    }
    
//Set up key inputs for usage later.
    this.sKey = this.input.keyboard.addKey('S');
    this.wKey = this.input.keyboard.addKey('W');
    this.spaceKey = this.input.keyboard.addKey('SPACE');
    this.tabKey = this.input.keyboard.addKey('Tab');


//Test enemies by spawning
/*
    this.spawnNewEnemy(0);
    this.spawnNewEnemy(1);
    this.spawnNewEnemy(2);
    this.spawnNewEnemy(3);
    this.spawnNewEnemy(4);
*/
    console.log("create works and is finished!");
    }

    update(time, delta) {
        let my = this.my;
        
        //console.log("update works!");
        //let my = this.my; //for bullets
        //let player = this.player; //for player

        //Moves Up and Down when W or S is pressed
        if (this.wKey.isDown) {
            this.player.y = this.player.y - playerSpeed * (delta / 1000);;
            if(this.player.y < 50){
                this.player.y = 50;
                console.log("Can't go past the screen!");
            }
        } else if (this.sKey.isDown) {
            this.player.y = this.player.y + playerSpeed * (delta / 1000);
            if(this.player.y > 550){
                this.player.y = 550;
                console.log("Can't go past the screen!");
            }
        }

//Check if tab key is pressed, attempt to move to endScreen
        if (this.tabKey.isDown){
            currHP = -1;
            this.endScene();
        }

        if (this.spaceKey.isDown) {
            //console.log("Space is held down");
            if (this.bulletCooldownCounter > this.bulletCooldown) {
                //console.log("Space is held down");
                // Check for an available bullet
                for (let bullet of my.sprite.bullet) {
                    
                    // If the bullet is invisible, it's available
                    if (!bullet.visible) {
                        bullet.x = this.player.x;
                        bullet.y = this.player.y;
                        bullet.visible = true;
                        this.bulletCooldownCounter = 0;
                        console.log("Emitted an object!");
                        break;    // Exit the loop, so we only activate one bullet at a time
                    }
                }
            }
            
        }
        //Code inspired by prof
        //Updates every visible bullet on screen
        //Also does collision logic when bullet hits a car.
        for (let bullet of my.sprite.bullet) {
            // if the bullet is visibile it's active, so move it
            if (bullet.visible) {
                bullet.x += this.bulletSpeed;
                for (let car of my.sprite.cars){
                    if (this.collides(bullet,car) && car.visible){
                        console.log("Collision between emitted object of player and enemy!");
                        this.sound.play("clashSFX", {
                            volume: .5   // Can adjust volume using this, goes from 0 to 1
                        });
                        bullet.visible = false;
                        car.health--;
                        if (car.health <= 0){
                            car.visible = false;
                            score = score + 200;
                        }
                    }
                }
            }
            // Did the bullet move offscreen? If so,
            // make it inactive (make it invisible)
            // This allows us to re-use bullet sprites
            if (bullet.x > 800) {
                bullet.visible = false;
            }
        }
        //Same as the player bullets, but for enemy emitted objects now
        //Now checks for collision of player
        for (let bullet of my.sprite.enemyBullet) {
            // if the bullet is visibile it's active, so move it
            if (bullet.visible) {
                bullet.x -= this.bulletSpeed;
                if(this.collides(bullet,this.player)){
                    bullet.visible = false;
                    this.playerDamaged();
                }
                if (bullet.x > 800) {
                    bullet.visible = false;
                }
            }
        
            // Did the bullet move offscreen? If so,
            // make it inactive (make it invisible)
            // This allows us to re-use bullet sprites
            if (bullet.x > 800) {
                bullet.visible = false;
            }
        }
        //Tracks how long ago the last emitted object was.
        this.bulletCooldownCounter = this.bulletCooldownCounter + delta/1000;
        elaspedTime = elaspedTime + delta/1000;
        currSpawnTime = currSpawnTime + delta/1000;
        //console.log(elaspedTime);

        //Collision check if car made it far enough into the path.
        for (let car of my.sprite.cars){
            if (car.visible && car.x < 75){
                car.visible = false;
                this.playerDamaged();
            }
        }

// Spawns up to 3 cars every # of seconds in a random lane
        if (currSpawnTime > spawnTime){
            //Decide how many cars to spawn
            let amtToSpawn = Math.floor(Math.random() * (4 - 1)) + 1;

            currSpawnTime = 0;
            let max = this.paths.length-1;
            let min = 0; 
            let randomNum = 0;
            for (let i = 0; i < amtToSpawn; i++){
                randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                console.log("Spawning a car on lane " + randomNum);
                this.spawnNewEnemy(randomNum);
            }
        }

        if(elaspedTime > 30){
            this.endScene();
        }
        


        //Collision checks for player emitted objects and enemy vehicles.

    }
}
