export default class Polygon {
    constructor(p5, x, y, colour, speed, points = 6, timesToDraw = 2) {
        this.p = p5;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.speed = speed;
        this.points = points;
        this.timesToDraw = timesToDraw;
        this.radius = 1;
        this.canUpdate = true;
    }

    update(){
        if(this.radius < this.p.width && this.canUpdate){
            this.radius = this.radius + this.speed;
        }
    }

    draw(divisor) {
        const angle = 360 / this.points;
        this.p.stroke(this.colour);
        this.p.beginShape();
        for (let a = 0; a < 360; a += angle) {
            let sx = this.x + this.p.cos(a) * this.radius / divisor;
            let sy = this.y + this.p.sin(a) * this.radius / divisor;
            this.p.vertex(sx, sy);
        }
        this.p.endShape(this.p.CLOSE);
    }
}
