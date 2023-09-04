import {HealthBar} from './healthBar.js';
export class Enemy {
    constructor(game){
        this.game = game;
        
        this.width= 32;
        this.height= 32;
        this.meleeCombatRadius = 25;
        this.markedForDeletion = false;
        this.inCombat = false;
        this.moveBase = 15;
        this.moveVariance = 20;
        this.thac0Bonus = 0;
        this.level = 1;
        this.hitPoints = 5;
        this.maxHitPoints = 5; 
        this.moveInterval = 2000 + Math.floor(Math.random()*4000);
        this.moveTimer = 0;
        this.moveToX = 0;
        this.moveToY = 0;
        this.attacks = 1;
        
        this.x = Math.floor(Math.random() * this.game.WIDTH - this.width );
        this.y = Math.floor(Math.random() * this.game.HEIGHT -this.height );
        /* this.image = document.getElementById('skeleton1'); */
        this.healthBar = new HealthBar(this);
        this.moveSpeed = Math.floor(Math.random() * this.moveVariance + this.moveBase);
    }
    draw(ctx){
        ctx.fillStyle = 'red';
        if (this.game.debugMode) ctx.fillRect(this.x - this.width * 0.5, this.y - this.height * 0.5 , this.width, this.height);
        
        
        if (this.game.debugMode) {
            // melee radius circle            
            this.inCombat ? ctx.fillStyle ='orange' : ctx.fillStyle ='black';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.meleeCombatRadius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.font = 'bold 18px serif';
            ctx.fillText(this.hitPoints+ '/'+this.maxHitPoints, this.x -this.width *0.3 , this.y +this.height * 1.2);
        }
        
        this.healthBar.draw(ctx);
        ctx.fillStyle = 'black'
        
    }
    update(deltaTime){
        
        if (this.game.soundMode) this.sound1.play();
        this.moveToX = this.x + this.moveSpeed;
        this.moveToY = this.y + this.moveSpeed;
  
        if ((this.x < this.game.player.x)) {
            this.x += this.moveToX / this.moveInterval;
        } else {
            this.x -= this.moveToX / this.moveInterval;
        }
        if ((this.y < this.game.player.y)) {
            this.y += this.moveToY / this.moveInterval;
        } else {
            this.y -= this.moveToY / this.moveInterval;
        }
    }
    move(){
  /*       this.sound1.play()
        if (this.x > this.game.player.x) this.x -= Math.floor(Math.random() * this.moveDistance + 5);
        if (this.x < this.game.player.x) this.x += Math.floor(Math.random() * this.moveDistance + 5);
        if (this.y < this.game.player.y) this.y += Math.floor(Math.random() * this.moveDistance + 5);
        if (this.y > this.game.player.y) this.y -= Math.floor(Math.random() * this.moveDistance + 5);
         */
    }
}
export class Skeleton extends Enemy {
    constructor(game){
        super(game);
        this.image = document.getElementById('skeleton1');
        this.name ='skeleton';
        this.experiance = 200;
        this.armourClass = 7;
        this.weaponDamage = 4;
        this.hitPoints = 5;
        this.maxHitPoints = 5;
        this.coins = Math.floor(Math.random()* 15);
        this.sound1 = new Audio('../audio/mnstr9.wav');
        this.deathSound = new Audio('../audio/Falling Bones.wav');
       // dificlulty scalling
       // this.level = Math.floor(this.game.wave/3) 
    }
    draw(ctx){
        super.draw(ctx);
        ctx.drawImage(this.image, this.x - this.width * 0.5, this.y - this.height * 0.5);

    }
}