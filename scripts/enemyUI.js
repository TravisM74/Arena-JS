export class EnemyUI {
    constructor(){
        
        this.time = 0;
        this.startX = 500;
        this.startY = 40;
        this.name= '';
        
        
    }
    draw(context){
        context.save();
        context.fillStyle= 'black';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = 'black';
        context.font = 'bold 30px serif';
        if (this.enemy.inCombat) {
            context.fillText('Name : ' + this.enemy.name, this.startX , this.startY );
            context.fillText('Player XP : ' + this.enemy.experiance, this.startX , this.startY + 30);
            context.fillText('HitPoints : ' + this.enemy.hitPoints +' / ' + this.enemy.maxHitPoints, this.startX , this.startY +60);

        }
        
    }
    update(enemy){
        this.enemy = enemy;
        this.meleeStatus = this.game.meleeConflict.meleeFight;
    }
}