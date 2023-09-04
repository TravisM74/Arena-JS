export class HitUI {
    constructor(game){
        this.game= game;
        this.hitTaken = 0;
        this.hitGiven = 0;
        this.displayInterval = 1000;
        this.displayTimer = 0;
        this.a ;
        this.b ;

    }
    draw(context) {
        context.save();
        context.fillStyle= 'red';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = 'black';
        context.font = 'bold 40px serif';
        if (this.hitTaken > 0 ) {
            context.fillText('-' + this.hitTaken , this.a.x , this.a.y -20);
        };
        if (this.hitTaken < 0 ) {
            context.fillText('miss' , this.a.x , this.a.y -20);
        };
        
        if (this.hitGiven > 0) {
            context.fillText('-' + this.hitGiven , this.b.x , this.b.y + 30);
        };
        if (this.hitGiven < 0) {
            context.fillText('miss' , this.b.x , this.b.y + 30);
        };
       
        context.restore();
    }
    updateData(a, damageA, b, damageB){
        this.hitTaken = damageA;
        this.hitGiven = damageB;
        if (damageA === 0) this.hitTaken= -1;
        if (damageB === 0) this.hitGiven= -1;
        this.a = a;
        this.b = b;
        this.displayTimer= 0;
      

    }
    update(deltaTime){
        if (this.displayTimer > this.displayInterval){
            this.hitTaken= 0;
            this.hitGiven= 0;
            this.displayTimer=0;
        } else {
            this.displayTimer += deltaTime;
        }
    }
}