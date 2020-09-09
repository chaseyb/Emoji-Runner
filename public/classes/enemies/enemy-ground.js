/* Enemy defines state & ability methods for enemies,
    may need unique classes & files for different types */

class EnemyGround {
    constructor() {
        // size of underlying circle, adjust as needed
        this.circ = 75;
        this.x = width;
        this.y = height - 80; // slightly off bottom
    }

    // begins off right edge
    show() {
        // args: image(image var, top edge, left edge, width, height);
        image(enemyGrImg, this.x, this.y, this.circ, this.circ);
    }

    // adjust speed as needed
    move() {
        this.x -= 11;
    }

    // for colliding with player
    hide() {
        this.x = -width;
        this.y = -height;
    }
}

// p5.js Shapes: https://p5js.org/reference/#group-Shape