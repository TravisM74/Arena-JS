export class WaveWindow {
    constructor(game){
        this.game = game;
        this.game = game
        this.time = 0;
        this.startX = 260;
        this.startY = 200;
        this.display = true;
        this.colorTimer = 0;
        this.colorInterval = 1;
        this.blueColor = 150;
        this.color = `rgb(0,0,${this.blueColor})`;
    }
    draw(ctx){
        if (this.display) {
            ctx.clearRect(0,0,this.game.WIDTH,this.game.HEIGHT);
            ctx.save();
            
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowColor = 'black';
            ctx.font = 'bold 30px serif';
            ctx.fillStyle = 'green';
            if ((this.display)&&(!this.game.player.defeatedInCombat)) ctx.fillText('Wave ' + (this.game.enemyCount-1) + ' Complete', this.startX , this.startY );
            ctx.fillText(this.game.player.lives +' Lives Remaning', this.startX , this.startY + 30);
            ctx.fillStyle= this.color;
            ctx.fillText('"space"' , this.startX +40 , this.startY + 60);
            ctx.fillStyle = 'green';
            ctx.fillText(' to continue ...' , this.startX , this.startY + 90);

        }
        
    }
    update(deltaTime){
        if (this.colorTimer > this.colorInterval){
            this.colorTimer = 0;
            this.blueColor++;
            if (this.blueColor > 255) this.blueColor-= 100;
            this.color = `rgb(0,0,${this.blueColor})`;
        } else {
            this.colorTimer+= deltaTime;
        }
    }
}
