export default class Polygon {
    constructor(p5, x, y, colour, points = 6) {
        this.p = p5;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.points = points;
        this.radius = 1;
    }

    update(){
        if(this.radius < this.p.width){
            this.radius++;
        }
    }

    draw() {
        const angle = 360 / this.points;
        this.p.stroke(this.colour);
        this.p.beginShape();
        for (let a = 0; a < 360; a += angle) {
            let sx = this.x + this.p.cos(a) * this.radius;
            let sy = this.y + this.p.sin(a) * this.radius;
            this.p.vertex(sx, sy);
        }
        this.p.endShape(this.p.CLOSE);

        this.p.beginShape();
        for (let a = 0; a < 360; a += angle) {
            let sx = this.x + this.p.cos(a) * this.radius / 2;
            let sy = this.y + this.p.sin(a) * this.radius / 2;
            this.p.vertex(sx, sy);
        }
        this.p.endShape(this.p.CLOSE);
    }
}
