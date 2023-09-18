import {HealthBar} from './healthBar.js';
import {Dust} from './particle.js';
import {HealUI, LevelUP, ItemGain} from './hitUI.js';
export class Player {
    constructor(game){
        this.game = game
        this.width = 32;
        this.height= 32;
        this.reset();
        // also used as pickup radius
        this.meleeCombatRadius = 20;
        
        this.attackTimer = 0;
        this.restInterval = 1000;
        this.restTime= 0;
        this.thac0Bonus = 0;
        
        this.mainHand = 'fist';
        this.offHand = 'fist';
        this.armour = 'leather';

        this.healthBar = new HealthBar(this);
        this.walkingSound = new Audio('../audio/footstep00.ogg')
        this.deathSound = new Audio('../audio/aargh0.ogg');
        this.levelUpSound = new Audio('../audio/levelup.wav');
        this.missSound = new Audio('../audio/swosh-01.flac');
        this.hitSound = new Audio('../audio/5.ogg');
        
        this.img = document.getElementById('hr1');

        this.pTimer =0;
        this.pInterval = 300;
        this.move= true;
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
        this.drawFacing(ctx);
        if (!this.game.debugMode) ctx.drawImage(this.img, this.x- this.width * 0.5, this.y -this.height *0.5, this.width, this.height);
        this.healthBar.draw(ctx);
    }
    update(deltaTime){
        
        //Movement
        this.movement(deltaTime);
        //Boundries
        if (this.x > this.game.WIDTH) this.x = this.game.WIDTH;
        if (this.x < 0 ) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.HEIGHT) this.y = this.game.HEIGHT;

        this.levelCheck();
        this.itemCollection();
        
    }
    itemCollection(){
        //collision with item
        this.game.items.forEach((item) => {
            let [collision,distance, sumOfRadii, dx ,dy] = this.game.checkcollision(this, item);
            if (collision){
                //picked up
                item.activate();
                this.game.displayHits.push(new ItemGain(this, '+1 Potion'));
                if (this.game.soundMode) this.game.takeSound.play();
                item.markedForDeletion = true;
            }
        });

    }
    creatDust(deltaTime){
        if (this.pTimer > this.pInterval) {
            this.game.particles.push(new Dust(this.game, this.x , this.y+ this.height * 0.5));
            this.pTimer= 0;
        } else {
            this.pTimer += deltaTime;
        }

    }

    drawFacing(ctx){
        ctx.fillStyle ='black';
        if (this.facing === 'east' ) {
            if (this.game.debugMode){
                ctx.beginPath();
                ctx.moveTo(this.x - 10, this.y +10);
                ctx.lineTo(this.x + 10, this.y);
                ctx.lineTo(this.x - 10, this.y -10);
                ctx.closePath();
            } else this.img = document.getElementById('hr1');
            
        }
        if (this.facing === 'west'  ) {
            if (this.game.debugMode){
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y -10);
                ctx.lineTo(this.x - 10, this.y);
                ctx.lineTo(this.x + 10, this.y +10);
                ctx.closePath();
            } else this.img = document.getElementById('hl1');
        }
        if (this.facing === 'south'  ) {
            if (this.game.debugMode){
                ctx.beginPath();
                ctx.moveTo(this.x - 10, this.y -10);
                ctx.lineTo(this.x +10, this.y - 10);
                ctx.lineTo(this.x + 0, this.y + 10);
                ctx.closePath();
            } else this.img = document.getElementById('hf1');
        }
        if (this.facing === 'north'  ) {
            if (this.game.debugMode){
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y +10);
                ctx.lineTo(this.x -10, this.y + 10);
                ctx.lineTo(this.x + 0, this.y - 10);
                ctx.closePath();
            } else this.img = document.getElementById('hb1');
        } 
        ctx.fill(); 
    }

    movement(deltaTime){
        if (((this.game.input.keys.indexOf('ArrowDown') > -1) || (this.game.input.keys.indexOf('s') > -1)) && ((this.state==='adventuring') && (this.game.enemies.length > 0))) {
            this.y+= this.game.gameSpeed;
            this.facing='south';
            if (this.game.soundMode) this.walkingSound.play();
            this.creatDust(deltaTime);
        }
        if (((this.game.input.keys.indexOf('ArrowRight') > -1) || (this.game.input.keys.indexOf('d') > -1)) && ((this.state==='adventuring')  && (this.game.enemies.length > 0))){
            this.x+= this.game.gameSpeed;
            this.facing='east';  
            if (this.game.soundMode) this.walkingSound.play();  
            this.creatDust(deltaTime); 
        } 
        
        if (((this.game.input.keys.indexOf('ArrowLeft') > -1) || (this.game.input.keys.indexOf('a') > -1)) && ((this.state==='adventuring')  && (this.game.enemies.length > 0))) {
            this.x-= this.game.gameSpeed;
            this.facing='west';
            if (this.game.soundMode) this.walkingSound.play();
            this.creatDust(deltaTime);
        }
        if (((this.game.input.keys.indexOf('ArrowUp') > -1)  || (this.game.input.keys.indexOf('w') > -1)) && ((this.state==='adventuring')  && (this.game.enemies.length > 0))){
            this.y-= this.game.gameSpeed;
            this.facing='north';
            if (this.game.soundMode) this.walkingSound.play();
            this.creatDust(deltaTime);
        }
    }
    playerResting(deltaTime){
        this.state='resting';
        if (this.restTime > this.restInterval ){
            this.restTime = 0;
            if (this.hitPoints < this.maxHitPoints ){
                this.hitPoints ++;
                this.game.displayHits.push(new HealUI(this, 1));
            }
            if (this.hitPoints === this.maxHitPoints) this.state='adventuring';   
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
        this.attackInterval = 1500;
        this.weaponDamage = 4;
        this.bonusDamage = 0;
        this.experiance = 0;
        this.victories = 0;
        this.knockOuts = 0;
        this.attacks = 1;
        this.state = 'adventuring';
        this.inCombat = false;
        this.coins = 0;
        this.healthPotions = 0;
        document.getElementById('health-pot-charges').innerText=`${this.healthPotions}`;
        this.defeatedInCombat = false;
    }
    healWithPotion() {
        console.log('button activated script')
        if((this.healthPotions > 0) && (this.hitPoints !== this.maxHitPoints)) {

            this.healthPotions--;
            document.getElementById('health-pot-charges').innerText=`${this.healthPotions}`;
            if (this.hitPoints < this.maxHitPoints * 0.5){
                this.damage= Math.floor(Math.random()*4);
                this.healAmount = this.maxHitPoints - this.hitPoints - this.damage;
                this.hitPoints = this.maxHitPoints - this.damage;
                this.game.displayHits.push(new HealUI(this, this.healAmount ))
            } else {
                this.healAmount = Math.floor(Math.random()*8 +1);
                this.hitPoints += this.healAmount;
                this.game.displayHits.push(new HealUI(this, this.healAmount));
                if (this.hitPoints > this.maxHitPoints) this.hitPoints = this.maxHitPoints; 
            }
        }
    }
    collectHealthPotion(){
        this.healthPotions++;
        document.getElementById('health-pot-charges').innerText=`${this.healthPotions}`;
    }
    levelUp(){
        if (this.game.soundMode) this.levelUpSound.play();
        this.level++;
        document.getElementById('level-count').innerText=`${this.level}`;
        this.thac0Bonus++;
        this.maxHitPoints += Math.floor(Math.random()*10)+1;
        this.hitPoints = this.maxHitPoints;
        this.game.displayHits.push(new LevelUP(this.game.player, 'Level UP')); 
    }
    levelCheck(){
        //leveling 
        if ((this.experiance >= 1500) && (this.level === 1)) this.levelUp();
        if ((this.experiance >= 3000) && (this.level === 2)) this.levelUp();
        if ((this.experiance >= 5000) && (this.level === 3)) this.levelUp();
        if ((this.experiance >= 8000) && (this.level === 4)) this.levelUp();
        if ((this.experiance >= 11000) && (this.level === 5)) this.levelUp();
        if ((this.experiance >= 15000) && (this.level === 6)) {
            this.levelUp();
            this.attacks++;
        }
    }
}