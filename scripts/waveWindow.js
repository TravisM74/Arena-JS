export class WaveWindow {
    constructor(game){
        this.game = game;
        this.game = game
        this.time = 0;
        this.startX = 20;
        this.startY = 40;
        this.display = true;
    }
    draw(ctx){
        if (this.display) ctx.clearRect(0,0,this.game.WIDTH,this.game.HEIGHT);
        ctx.save();
        ctx.fillStyle= 'green';
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = 'black';
        ctx.font = 'bold 30px serif';
       
        if (this.display) ctx.fillText('Wave ' + (this.game.enemyCount-1) + ' Complete', this.startX , this.startY );
        if (this.display) ctx.fillText(this.game.player.lives +' Lives Remaning', this.startX , this.startY + 30);
        if (this.display) ctx.fillText('"space" to continue' , this.startX , this.startY + 60);
        
    }
    update(){
        
    }
}
