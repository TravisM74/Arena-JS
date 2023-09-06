export class HitUI {
    constructor(attacker, defender, damage){
        this.attacker = attacker;
        this.defender = defender;
        this.damage = damage;
        this.displayInterval = 800;
        this.displayTimer = 0;
        this.markedForDeletion = false;
        

    }
    draw(context) {
        context.save();
        context.fillStyle= 'red';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = 'black';
        context.font = 'bold 40px serif';
       
        if (this.damage < 1)  {
            context.fillText('Miss' , this.attacker.x , this.attacker.y + 30 -(this.displayTimer * 0.05));
        }
        if (this.damage > 0) { 
            context.fillText( this.damage , this.defender.x , this.defender.y + 30 -(this.displayTimer * 0.05));   
        };
       
        context.restore();
    }
    update(deltaTime){
        this.displayTimer += deltaTime;

        if (this.displayTimer > this.displayInterval) this.markedForDeletion = true;
      

    }
    
}