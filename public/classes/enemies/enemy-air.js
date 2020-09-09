/* Enemy defines state & ability methods for enemies,
    may need unique classes & files for different types */

class EnemyAir {
    constructor() {
        // size of underlying circle, adjust as needed
        this.circ = 40;
        this.x = width;
        this.y = 390; // adjust height, lower num = higher on screen
    }

    // begins off right edge
    show() {
        // args: image(image var, top edge, left edge, width, height)
        image(enemyAirImg, this.x, this.y, this.circ, this.circ);
    }

    // adjust speed as needed
    move() {
        this.x -= 8;
    }

    // for colliding with player
    hide() {
        this.x = -width;
        this.y = -height;
    }
}

    // p5.js Shapes: https://p5js.org/reference/#group-Shape