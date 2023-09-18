export class GameOverWindow {
    constructor(game){
        this.game = game;
        this.game = game
        this.time = 0;
        this.startX = 20;
        this.startY = 40;
        
    }
    draw(ctx){
        ctx.save();
        ctx.fillStyle= 'green';
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = 'black';
        ctx.font = 'bold 30px serif';
        
        if (this.game.gameOver){
            ctx.clearRect(0,0,this.game.WIDTH,this.game.HEIGHT)
            ctx.fillText('Game Over', this.startX , this.startY );
            ctx.fillText(this.game.player.lives +' Lives Remaning', this.startX , this.startY + 30);
            ctx.fillText('"r" to restart' , this.startX , this.startY + 60);
        } 
        if (this.game.gameWin){
            ctx.clearRect(0,0,this.game.WIDTH,this.game.HEIGHT)
            ctx.fillText('Congratulations', this.startX , this.startY );
            ctx.fillText(this.game.player.lives +' Lives Remaning', this.startX , this.startY + 30);
            ctx.fillText('"r" to restart' , this.startX , this.startY + 60);
        } 
        
    }
    update(){
        
    }
    
}
