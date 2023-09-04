export class PlayerUI {
    constructor(game){
        this.game = game
        this.time = 0;
        this.meleeStatus = true;
        this.startX = 20;
        this.startY = 40;
    }
    draw(context){
        context.save();
        context.fillStyle= 'black';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = 'black';
        context.font = 'bold 30px serif';
       
        context.fillText('Player HP : ' + this.game.player.hitPoints +' / ' + this.game.player.maxHitPoints, this.startX , this.startY );
        context.fillText('Player XP : ' + this.game.player.experiance, this.startX , this.startY + 30);
        context.fillText('Player State : ' + this.game.player.state, this.startX , this.startY + 60);
        context.fillText('Coins : ' , this.startX , this.startY + 90);
        context.fillStyle= 'gold';
        context.fillText( this.game.player.coins, this.startX +120, this.startY + 90);

        context.fillStyle= 'black';
        context.fillText('Victories : ' + this.game.player.victories, this.startX , this.startY + 120);
        
    }
    update(time){
        this.time = time;
        this.meleeStatus = this.game.meleeConflict.meleeFight;
    }
}