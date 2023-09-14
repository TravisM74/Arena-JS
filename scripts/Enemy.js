import {HealthBar} from './healthBar.js';
import {Dust} from './particle.js';
export class Enemy {
    constructor(game, level){
        this.game = game;
        
        this.width= 32;
        this.height= 32;
        this.meleeCombatRadius = 20;
        this.markedForDeletion = false;
        this.inCombat = false;
        this.moveBase = this.game.gameSpeed * 0.04;
        this.moveVariance = Math.random() *  0.08
        this.moveSpeedModifer = this.moveBase + (this.game.enemyCount *.05 ) + (this.moveVariance);
       
        this.level = level;
        this.thac0Bonus = this.level -1;
        this.moveInterval = 1000;
        this.moveTimer = 0;
        
        this.attacks = 1;
        this.attackTimer = 0;
        this.xloc = Math.random() * 100;
        this.yloc = Math.random() * 100;
        this.x = Math.random() > 0.5 ?  this.game.WIDTH - this.xloc : this.xloc ;
        this.y = Math.random() > 0.5 ?  this.game.HEIGHT - this.yloc : this.yloc ;
        this.loc= this.game.checkDistance(this,this.game.player);
        this.volumeLevel=0;
        this.noiseDistance = 400;
        this.pTimer = 0;
        this.pInterval= 200;
        this.afterItems = true;
     
        this.healthBar = new HealthBar(this);
       
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
            ctx.fillStyle ='black';
            ctx.fillText(this.hitPoints+ '/'+this.maxHitPoints, this.x -this.width * 0.3 , this.y +this.height * 1.2);
        }
        
        this.healthBar.draw(ctx);
        ctx.fillStyle = 'black'
        
    }
    update(deltaTime){
        this.createDustParticles(deltaTime);
        
        this.sound1.volume = this.soundVolume();
        if (this.game.soundMode) this.sound1.play();
        this.huntForItem();
        //distance froim target
        this.dx = this.moveToX - this.x;
        this.dy = this.moveToY - this.y;
        //calculate a move portion of that distance
        const distance = Math.hypot(this.dy,this.dx);
        // move that distance by this portion
        this.xspeed =  this.dx / distance || 0;
        this.yspeed =  this.dy / distance || 0;
        //modify the speed at which they move that distance
        this.x += this.xspeed * this.moveSpeedModifer ;
        this.y += this.yspeed * this.moveSpeedModifer;

        this.itemInteraction();
        this.checkEnemyCollision();
        
    }
    huntForItem(){
        // target player if no items at all
        if (this.game.items.length < 1) {
            this.moveToX = this.game.player.x;
            this.moveToY = this.game.player.y;
        }
        //see if the item is closer then the player, target closest
        if (this.afterItems) {
            this.game.items.forEach((item) => {
                let [collision,distance, sumOfRadii, dx ,dy] = this.game.checkcollision(this, item);
                let [collisionPlayer,distancePlayer, sumOfRadiiPlayer, dxPlayer ,dyPlayer] = this.game.checkcollision(this, this.game.player);
                if (distance < distancePlayer) { 
                    this.moveToX = item.x;
                    this.moveToY = item.y;
                } else {
                    this.moveToX = this.game.player.x;
                    this.moveToY = this.game.player.y;
                }
            });
        }
    }

    itemInteraction(){
        this.game.items.forEach((item) => {
            let [collision,distance, sumOfRadii, dx ,dy] = this.game.checkcollision(this, item);
            if (collision){
                //picked up
                if (this.game.soundMode) this.evilTakeSound.play();;
                item.markedForDeletion = true;
            }
        })
        
    }
    createDustParticles(deltaTime){
        //Dust particles
        if (this.pTimer > this.pInterval) {
            this.game.particles.push(new Dust(this.game, this.x , this.y+ this.height * 0.5));
            this.pTimer= 0;
        } else {
            this.pTimer += deltaTime;
        }
        
    }
    
    checkEnemyCollision(){
        // Enemy collision 
        this.game.enemies.forEach((e) => {
            let [collision,distance, sumOfRadii, dx ,dy] = this.game.checkcollision(this, e);
            if (collision){
                //console.log('collision');
                if (e !== this){
                    const unit_X = dx / distance;
                    const unit_Y = dy / distance;
                    this.x = e.x + (sumOfRadii + 1) * unit_X;
                    this.y = e.y + (sumOfRadii + 1) * unit_Y;
                    
                    //trying to fix the que  behind issue 
                    //console.log('x:'+ this.x,e.x,'y:'+ this.y, e.y);
                    if (this.x < e.x ) this.y++;
                    if (this.x > e.x ) this.y--;
                    this.y > e.y ? this.x++ : this.x--;
                }   
                
                
            };
            
        })
    }
    
    calculateHitPoints(){
        let tempHP = 0;
        for (let i = 0; i < this.level; i++ ){
            tempHP += Math.floor(Math.random()*8)+1; 
        } 
        return tempHP;    
    }
}
export class Skeleton extends Enemy {
    constructor(game, level){
        super(game, level);
        this.image = document.getElementById('skeleton1');
        this.name ='skeleton';
        this.experiance = 200 * this.level;
        this.meleeCombatRadius = 20;
        
        this.maxHitPoints = this.calculateHitPoints();
        this.hitPoints = this.maxHitPoints;
    
        this.armourClass = 9;
        this.weaponDamage = 4;
        this.coins = Math.floor(Math.random()* 15);
        this.sound1 = new Audio('../audio/mnstr9.wav');
        this.deathSound = new Audio('../audio/Falling Bones.wav');
        this.attackInterval = 1800;
        this.moveBase = this.game.gameSpeed * 0.02 ;
        this.moveSpeed = this.moveBase + (this.game.enemyCount *.05 ) + (this.moveVariance);
        //console.log(this.moveBase, this.moveVariance,this.moveSpeed);
        this.moveVariance = Math.random() *  .6;
        this.evilTakeSound = new Audio('../audio/witch_cackle-1.ogg');
        this.afterItems = true;
        
    }
    draw(ctx){
        super.draw(ctx);
        ctx.drawImage(this.image, this.x - this.width * 0.5, this.y - this.height * 0.5);
        
    }
    soundVolume(){
        let [collision, distance, sumOfRaddi, dx , dy] = this.game.checkcollision(this, this.game.player);
        if (distance < this.noiseDistance) {
            this.volumeLevel = 1-(distance / this.noiseDistance);
        } else {
            this.volumLevel = 0;
        }
        return this.volumeLevel;
    }
}