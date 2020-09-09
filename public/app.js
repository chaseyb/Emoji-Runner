/* eslint-disable */

/* ESLint hates p5js syntax, especially the undeclared vars and uncalled
    functions! Leave that comment on line 1 to disable! */

// loop soundtrack for game
const beat = new Audio('./sounds/soundtrack.mp3');
// if it ends, reset the playback position to beginning
beat.addEventListener('ended', function () {
    this.currentTime = 0.14;
    this.play();
}, false);
// play it!
beat.play();

// the player, enemies & levels
let character;
let enemies = [];
let backImg;
let levelCounter = 0;
const characterBlinkDur = 0.1; // duration in seconds of a single blink during Characters invisibility
const characterExplode = 0.3; // duration of the Characters explosion in seconds
const characterInv = 3; // duration of the Characters invisibility in seconds


// adjust file name & path for images & uncomment
function preload() {
    /* we can get pretty granular here, preloading images for
        all potential enemies (will need new classes for each) */
    charImg = loadImage('./images/player/smile.gif');
    enemyGrImg = loadImage('./images/enemies/rooster.gif');
    enemyAirImg = loadImage('./images/enemies/bee.gif');
    backImg = loadImage('./images/backgrounds/mystic-forest.jpg');
};

/* called first in draw, run backgrounds, check where they are in scroll,
    call levelSwitch() to see when to change */
function levelScroll() {
    // create two background images
    image(backImg, x, 0, width, height);
    image(backImg, x2, 0, width, height);
    // decrement values along x axis (move right to left)
    x -= scroll;
    x2 -= scroll;
    // once the images have scrolled complete off, reset
    if (x < -width) {
        x = width;
        levelCounter++;
        console.log(levelCounter);
        levelSwitch();
    }
    if (x2 < -width) {
        x2 = width;
        levelCounter++;
        console.log(levelCounter);
        levelSwitch();
    }
}

// switch case to change levels and enemies!
function levelSwitch() {
    switch (true) {
        case (levelCounter >= 9 && levelCounter < 19):
            backImg = loadImage('./images/backgrounds/pink-mountains.jpg');
            enemyGrImg = loadImage('./images/enemies/unicorn.gif');
            enemyAirImg = loadImage('./images/enemies/butterfly.gif');
            levelBanner();
            break;
        case (levelCounter >= 19 && levelCounter < 29):
            backImg = loadImage('./images/backgrounds/winter.jpg');
            enemyGrImg = loadImage('./images/enemies/snowman.gif');
            enemyAirImg = loadImage('./images/enemies/coldface.gif');
            levelBanner();
            break;
        case (levelCounter >= 29 && levelCounter < 39):
            backImg = loadImage('./images/backgrounds/ocean.jpg');
            enemyGrImg = loadImage('./images/enemies/whale.gif');
            enemyAirImg = loadImage('./images/enemies/fish.gif');
            levelBanner();
            break;
        // for now, at 49+ it just keeps playing indefinitely
        case (levelCounter >= 39 && levelCounter < 49):
            backImg = loadImage('./images/backgrounds/lava.jpg');
            enemyGrImg = loadImage('./images/enemies/devil.gif');
            enemyAirImg = loadImage('./images/enemies/fire.gif');
            levelBanner();
            break;
        /* HERE could trigger win with some function? */
        // case (levelCounter >= 49):
        //     writeYouWonFunc();
        //     break;
        // OR...
        /* RESTART from level one and keep scoring points! */
        case (levelCounter >= 49):
            levelCounter = 0;
            backImg = loadImage('./images/backgrounds/mystic-forest.jpg');
            enemyGrImg = loadImage('./images/enemies/rooster.gif');
            enemyAirImg = loadImage('./images/enemies/bee.gif');
            lev = 1;
            i = 0;
            levelBanner();
            break;
    }
}

// level banner
let lev = 1;
let i = 0;
const levMsg = ["Yeah!", "Woo!", "Cool!", "Nice!", "Hot!"];
function levelBanner() {
    // every tenth frame scroll, update lev & levMsg fof banner
    if (levelCounter === 9 || levelCounter === 19 ||
        levelCounter === 29 || levelCounter === 39) {
        lev++;
        i++;
    }
    let levelNum = select("#levelNum");
    /* the levMsg stuff might be dumb. if cut, also remove let i = 0;
        and the i++; in each switch/case */
    levelNum.html(`Level ${lev} : ${levMsg[i]}`);
}

// lives banner
let lives = 3;
function livesCounter() {
    let livesNum = select("#livesNum");
    livesNum.html(`Lives : ${lives}`)
}

// setup our game arena
function setup() {
    // adjust canvas size according to background gif
    createCanvas(1100, 600);
    character = new Character();
    // scoreboard counter in var for start/stop
    runScore = setInterval(scoreCounter, 100);
    // line up our second image, see below
    x2 = width;
};


// scoreboard
let counter = 0; // send to database at gameover
function scoreCounter() {
    let userScore = select("#scoreboard");
    counter++;
    userScore.html(counter);
}

// called by playAgain() - send score to database
function StoreUserData(score, level) {
    let runner = {
        score: score,
        lvl: level
    }
    $.ajax({
        method: "PUT",
        url: "/api/game",
        data: runner
    }).then(function () {
        window.location.href = "/profile";
        setTimeout(function () {
            location.reload();
        }, 1000);
    });
}

// player controls
function keyPressed() {
    // spacebar or up arrow jump
    if (key === ` ` || keyCode === UP_ARROW) {
        character.jump()
        // triggers Jump Sound when space bar is pressed
        // const audio = new Audio('./sounds/jump-fx.mp3');
        // audio.play();
    }
    // fire projectiles??
    if (keyCode === 70) {
        character.shoot() // not real yet
    }
};

// vars for background scroll & lives
let x = 0;
let x2;
let scroll = 4;
// draws the scene in a loop, p5 functionality
function draw() {
    // run background & check level status
    levelScroll();
    // add character
    character.show();
    character.move();
    // fill array with some randomly generated enemies
    enemyCreator();
    // then send our array of badguys
    for (let i of enemies) {
        // random millisecond value between 2 & 3k
        let rando = Math.floor(Math.random() * (3250 - 2250 + 1) + 2250);
        setTimeout(i.show(), i.move(), rando);
        // if you get hit, lose life. if out of lives, kill loop & playAgain()
        if (character.hits(i)) {
            lives--;
            livesCounter();
            // impact with enemy
            const punch = new Audio('./sounds/Sharp-Punch.mp3');
            punch.play();
            i.hide();
            if (lives === 0) {
                noLoop();
                clearInterval(runScore);
                beat.pause();
                const dead = new Audio('./sounds/gameover.wav');
                dead.play();
                playAgain();
            }
        }
    }
};

// enemy logic: first, random chance at having enemy
function enemyCreator() {
    // random() is p5 method: add more EnemyGround than EnemyAir
    if (random(0, 1) < 0.007) {
        enemies.push(enemy = new EnemyGround());
    }
    if (random(0, 1) < 0.003) {
        enemies.push(new EnemyAir());
    }
};

// temporary death function, use something nice like a Bootstrap modal
function playAgain() {
    // on gameover, show BS modal
    $('#game-over').modal('show');
    // if player clicks yes, reload the game
    $('#yes').click(function () {
        console.log(counter);
        // StoreUserData(counter, lev);
        location.reload();
    });
    // no, go home (or redirect to /profile?)
    $('#no').click(function () {
        console.log(`Game Over`);
        console.log(counter);
        StoreUserData(counter, lev);
        window.location = '/home';
    });
};