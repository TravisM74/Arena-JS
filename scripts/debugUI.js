export class DebugUI {
    constructor(game){
        this.game = game
        this.time = 0;
        this.meleeStatus = true;
        this.startX = 750;
        this.startY = 40;
    }
    draw(context){
        context.save();
        context.fillStyle= 'black';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = 'black';
        context.font = 'bold 20px serif';
        context.fillText('Location : ' + this.game.player.x + " : " + this.game.player.y, this.startX , this.startY);
        context.fillText('Facing : ' + this.game.player.facing , this.startX , this.startY + 20);
        context.fillText('Time : ' + (this.time /1000).toFixed(2) , this.startX , this.startY + 40);
        context.fillText('Melee Conflict : ' + this.meleeStatus , this.startX , this.startY + 60);

        context.fillText('Player HP : ' + this.game.player.hitPoints +' / ' + this.game.player.maxHitPoints, this.startX , this.startY + 80);
        context.fillText('Player XP : ' + this.game.player.experiance, this.startX , this.startY + 100);
        context.fillText('Player State : ' + this.game.player.state, this.startX , this.startY + 120);
        context.fillText('Player combat : ' + this.game.player.inCombat, this.startX , this.startY + 140);
        context.fillText('Sounds : ' + this.game.soundMode, this.startX , this.startY + 160);
        context.restore();

    }
    update(time){
        this.time = time;
        this.meleeStatus = this.game.meleeConflict.meleeFight;
    }
}