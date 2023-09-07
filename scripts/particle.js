export class Particle {
    constructor(game){
        this.game = game ;
        this.markedForDeletion = false;
        this.pInterval =50;
        this.pTimer = 0;

    }
    update(DeltaTime){
        this.x ;
        this.y ;
        this.size *= 0.95;
        if (this.size < 0.5) this.markedForDeletion = true;
    }
    draw(context){ 
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0 ,Math.PI * 2);
        context.fill();
    }
}

export class Dust extends Particle{
    constructor(game, x , y){
        super(game);
        this.size = Math.random() *5 +5 ;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color ='brown';
    }
    update(deltaTime){    
            if (this.pTimer > this.pInterval){
                this.size *= 0.95;
                this.pTimer = 0;
            } else {
                this.pTimer += deltaTime;
            }
            if (this.size < 0.5) this.markedForDeletion = true; 
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x , this.y, this.size, 0 , Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

export class Hit extends Particle{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() *5 +25 ;
        this.x = x;
        this.y = y;
        this.color= 'red';
      
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x , this.y, this.size, 0 , Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}

export class Glow extends Particle{
    constructor (game, x, y){
        super(game);
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = 25;
        this.cr = 0;
        this.cb = 0;
        this.cg = 0;
        this.color = 'rgb(0,0,255)';

    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x , this.y, this.size, 0 , Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    update(deltaTime){
        super.update(deltaTime);
        this.cb++;
        if(this.cb > 255) this.cb -= 255;
        //this.color = 'rgb('+this.cr+','+this.cg+','+this.cb+')'; 
        //console.log(this.color);
    }
}