/* No arrow functions, classes use (this) keyword */

// the player & enemies
let character;
let enemies = [];

// vars for character, enemy & background images
let charImg;
let enemyImg;
let backImg;

// adjust file name & path for images & uncomment
function preload() {
    /* we can get pretty granular here, preloading images for
        all potential enemies (will need new classes for each) */
    charImg = loadImage('./public/images/smile.gif');
    enemyGrImg = loadImage('./public/images/poo.gif');
    enemyAirImg = loadImage('./public/images/poo.gif');
    backImg = loadImage('./public/images/desert.jpg');
};

// setup our game arena
function setup() {
    // adjust canvas size according to background gif
    createCanvas(900, 450);
    character = new Character();
    // line up our second image, see below
    x2 = width;
};

function resetSketch() {
    /* blank for now, future home of more complex functions? like score saving,
        options to redirect to home etc. see playAgain() below */
}

// player controls
function keyPressed() {
    // spacebar or up arrow jump
    if (key === ` ` || keyCode === UP_ARROW) {
        character.jump()
    }
    // fire projectiles??
    if (keyCode === 70) {
        character.shoot() // not real yet
    }
};

// vars for background scroll
let x = 0;
let x2;
let scroll = 4;
// draws the scene in a loop, p5 functionality
function draw() {
    // background(backImg);  old - server static image
    // create two background images
    image(backImg, x, 0, width, height);
    image(backImg, x2, 0, width, height);
    // decrement values along x axis (move right to left)
    x -= scroll;
    x2 -= scroll;
    // once the images have scrolled complete off, reset
    if (x < -width) {
        x = width;
    }
    if (x2 < -width) {
        x2 = width;
    }
    // add character
    character.show();
    character.move();
    // fill array with some randomly generated enemies
    enemyCreator();
    // then send our array of badguys
    for (let i of enemies) {
        // random millisecond value between 2 & 3k
        let rando = Math.floor(Math.random() * (3000 - 2000 + 1) + 2000);
        setTimeout(i.show(), i.move(), rando);
        // if you hit any enemy, kill loop (and trigger whatever events)
        if (character.hits(i)) {
            noLoop();
            playAgain();
        }
    }
};

/* enemy logic: first, random chance at having enemy,
    adjust < num. (could this be improved?) */
function enemyCreator() {
    // random() is p5 method: add more EnemyGround than EnemyAir
    if (random(0, 1) < 0.008) {
        enemies.push(new EnemyGround());
    }
    if (random(0, 1) < 0.004) {
        enemies.push(new EnemyAir());
    }
};

// temporary death function, use something nice like a Bootstrap modal
function playAgain() {
    // modal: OK reloads, Cancel should eventually take user to homescreen
    if (confirm(`Would you like to play again?`)) {
        // resetSketch(); make if fancy? just reload for now
        location.reload();
    }
    else {
        console.log(`Game Over`);
    }
};