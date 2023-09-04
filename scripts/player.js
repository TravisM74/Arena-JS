import {HealthBar} from './healthBar.js';
export class Player {
    constructor(game){
        this.game = game
        this.width = 32;
        this.height= 32;
        this.reset();
        this.meleeCombatRadius = 25;
        
        this.attackTimer = 0;
        this.restInterval = 1000;
        this.restTime= 0;
        this.healthBar = new HealthBar(this);
        this.walkingSound = new Audio('../audio/footstep00.ogg')
        this.deathSound = new Audio('../audio/aargh0.ogg');
    }
    draw(ctx){
        
        // melee radius circle
        if (this.game.debugMode) {
            this.inCombat ? ctx.strokeStyle ='orange' : ctx.strokeStyle ='black';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.meleeCombatRadius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.fillStyle ='black';
        if (this.facing === 'east' ) {
            ctx.beginPath();
            ctx.moveTo(this.x - 10, this.y +10);
            ctx.lineTo(this.x + 10, this.y);
            ctx.lineTo(this.x - 10, this.y -10);
            ctx.closePath();
        }
        if (this.facing === 'west'  ) {
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y -10);
            ctx.lineTo(this.x - 10, this.y);
            ctx.lineTo(this.x + 10, this.y +10);
            ctx.closePath();
        }
        if (this.facing === 'south'  ) {
            ctx.beginPath();
            ctx.moveTo(this.x - 10, this.y -10);
            ctx.lineTo(this.x +10, this.y - 10);
            ctx.lineTo(this.x + 0, this.y + 10);
            ctx.closePath();
        }
        if (this.facing === 'north'  ) {
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y +10);
            ctx.lineTo(this.x -10, this.y + 10);
            ctx.lineTo(this.x + 0, this.y - 10);
            ctx.closePath();
        } 
        ctx.fill(); 
        this.healthBar.draw(ctx);
    }
    update(deltaTime){
        
        //Movement
        if ((this.game.input.keys.indexOf('ArrowDown') > -1) && (this.state==='adventuring')) {
            this.y+= this.game.gameSpeed;
            this.facing='south';
            if (this.game.soundMode) this.walkingSound.play();
        }
        if ((this.game.input.keys.indexOf('ArrowRight') > -1) && (this.state==='adventuring')){
            this.x+= this.game.gameSpeed;
            this.facing='east';  
            if (this.game.soundMode) this.walkingSound.play();   
        } 
        
        if ((this.game.input.keys.indexOf('ArrowLeft') > -1) && (this.state==='adventuring')) {
            this.x-= this.game.gameSpeed;
            this.facing='west';
            if (this.game.soundMode) this.walkingSound.play();
        }
        if ((this.game.input.keys.indexOf('ArrowUp') > -1)  && (this.state==='adventuring')){
            this.y-= this.game.gameSpeed;
            this.facing='north';
            if (this.game.soundMode) this.walkingSound.play();
        }
        //Boundries
        if (this.x > this.game.WIDTH) this.x = this.game.WIDTH;
        if (this.x < 0 ) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.HEIGHT) this.y = this.game.HEIGHT;

        
    }
    playerResting(deltaTime){
        this.state='resting';
        if (this.restTime > this.restInterval ){
            this.restTime = 0;
            if (this.hitPoints < this.maxHitPoints )this.hitPoints ++;
            if (this.hitPoints === this.maxHitPoints) this.state='adventuring';
            this.game.enemies.forEach((e)=> {
                e.move();
            })
        } else {
            this.restTime += deltaTime;
        }
    }
    reset(){
        this.facing = 'east'
        this.level = 1;
        document.getElementById('level-count').innerText=`${this.level}`;
        this.x = this.game.WIDTH /2;
        this.y = this.game.HEIGHT /2;
        this.hitPoints = 10;
        this.thac0Bonus = 0;
        this.lives= 3;
        this.maxHitPoints = 10;
        this.armourClass = 5;
        document.getElementById('armour-class').innerHTML = this.armourClass;
        this.attackInterval = 1000;
        this.weaponDamage = 4;
        this.experiance = 0;
        this.victories = 0;
        this.knockOuts = 0;
        this.attacks = 1;
        this.state = 'adventuring';
        this.inCombat = false;
        this.coins = 0;
        this.healthPotions = 0;
        document.getElementById('health-pot-charges').innerText=`${this.healthPotions}`;
    }
    healWithPotion() {
        console.log('button activated script')
        if(this.healthPotions > 0) {
            this.healthPotions--;
            document.getElementById('health-pot-charges').innerText=`${this.healthPotions}`;
            if (this.hitPoints < this.maxHitPoints * 0.5){
                this.hitPoints = this.maxHitPoints - Math.floor(Math.random()*4);
            } else {
                this.hitPoints += Math.floor(Math.random()*8 +1);
                if (this.hitPoints > this.maxHitPoints) this.hitPoints = this.maxHitPoints; 
            }
        }
    }
}