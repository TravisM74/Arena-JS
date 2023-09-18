
import {HitUI} from './hitUI.js';
import {Hit} from './particle.js';

export class MeleeCombat2 {
    constructor(game){
        this.game = game;
        
        this.enemiesInCombat = [];
        
        
    }
    checkMeleeContact(a,b){
        this.a = a ;
        this.b= b;
        this.dx = this.a.x - this.b.x;
        this.dy = this.a.y - this.b.y;
        this.distance = Math.hypot(this.dy,this.dx);
        this.sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
        //console.log(distance, sumOfRadii); 
        if((this.distance < this.sumOfRadii )&&(!this.b.inCombat)){
            this.addCombatant(b)
        }
    }

    addCombatant(enemy){
        this.enemy = enemy;
        this.enemy.inCombat = true;
        this.enemiesInCombat.push(this.enemy);
        //console.log(this.enemiesInCombat);
    }
    removeDead(){
        this.enemiesInCombat = this.enemiesInCombat.filter(enemy => !enemy.markedForDeletion);
    }
    playerAttack(){
        for (let i = 0 ; i < this.game.player.attacks; i++){
            //player Tried to hit Mob
            this.roll=Math.floor(Math.random()*20 +1);
            if (this.enemiesInCombat.length >0){
                if (( this.roll >= (20 - this.enemiesInCombat[0].armourClass)) ) {
                    this.damage = Math.floor(Math.random() * this.game.player.weaponDamage)+1 + this.game.player.bonusDamage;
                    this.enemiesInCombat[0].hitPoints -= this.damage + this.game.player.bonusDamage;
                    //display hit
                    this.game.displayHits.push(new HitUI(this.game.player, this.enemiesInCombat[0], this.damage));
                    this.game.hitParticles.push(new Hit(this.game, this.enemiesInCombat[0].x, this.enemiesInCombat[0].y ));
                    //console.log(this.roll ,b);
                    if (this.game.soundMode) this.game.player.hitSound.play();
                    this.removeDead();
                } else {
                    //console.log(this.roll, 'miss', b);
                    if (this.game.soundMode) this.game.player.missSound.play();
                    this.damage = 0;
                    //display Miss
                    this.game.displayHits.push(new HitUI(this.game.player, this.enemiesInCombat[0], this.damage));
                }

            }
            //check if Enemy got killed
            if (this.enemiesInCombat.length >0){
                if (this.enemiesInCombat[0].hitPoints <= 0 ){
                    this.game.player.experiance += this.enemiesInCombat[0].experiance;
                    this.game.player.coins+= this.enemiesInCombat[0].coins;
                    document.getElementById('coin-count').innerHTML = `${this.game.player.coins}`;
                    this.enemiesInCombat[0].markedForDeletion = true;
                    this.game.player.victories++;
                    if (this.game.soundMode) this.enemiesInCombat[0].deathSound.play();
                    this.game.loot.getLoot();
                    this.game.player.state ='adventuring';
                    if (this.enemiesInCombat.length > 0){
                        this.removeDead();
                    }
                }
            }
        }
    }
    enemyAttack(enemy){
            this.e= enemy;
            //Mob trys to hit player
            this.roll=Math.floor(Math.random()*20 +1);
            if (this.roll >= (20 - this.game.player.armourClass)) {
                this.damageTaken = Math.floor(Math.random() * this.e.weaponDamage)+1
                this.game.player.hitPoints -= this.damageTaken;
                //display hit
                this.game.displayHits.push(new HitUI(this.e, this.game.player, this.damageTaken));
                this.game.hitParticles.push(new Hit(this.game, this.game.player.x, this.game.player.y ));
                // check is player renderd unconcious
                if ((this.game.player.hitPoints < 1 ) &&( !this.game.player.state === 'ko')) {
                    this.game.player.experiance -= Math.floor(this.e.experiance * 0.5);
                    this.game.player.state='ko'
                    this.game.player.knockOuts++;
                    
                } 
                //console.log(this.roll,a);
                if (this.game.soundMode) this.e.hitSound.play();
            } else {
                //console.log(this.roll, 'miss', a)
                this.damageTaken = 0;
                if (this.game.soundMode) this.e.missSound.play();
                //display miss
                this.game.displayHits.push(new HitUI( this.e,this.game.player, this.damageTaken));
            }
            // display Damage 
            //this.game.hitUI.updateData(this.game.player, this.damageTaken, this.e ,this.damageGiven);
            //this.damageGiven = 0;
            //Enemie killed

        

    }
    playerStatusCheck(){
        //check for Win
        if (this.enemiesInCombat.length > 0){
            this.game.player.inCombat = true;
            this.game.player.state='Melee Combat';
        } else {
            this.game.player.inCombat = false;
            this.game.player.hitTimer = 0;
           
            //console.log(b);     
        }
        if (this.game.player.hitPoints <= 0) {
            this.gamePause= true;
            // runs off with some loot
            const coinTaken = Math.floor(this.game.player.coins *.3);
            this.game.player.coins-= coinTaken;
            document.getElementById('coin-count').innerHTML = `${this.game.player.coins}`;
            //lives reduced
            this.game.player.lives--;
            this.game.player.hitPoints = this.game.player.maxHitPoints;
            this.game.player.inCombat = false; 
            this.game.player.state = 'adventuring'; 
            this.game.player.hitTimer = 0;
            if (this.game.soundMode) this.game.player.deathSound.play();
            //all enemies in melee removed
            this.game.enemies = [];
            this.enemiesInCombat = [];
            this.game.enemyCount--;
            this.game.wave--;
            this.game.player.defeatedInCombat = true;
        }          
        
    }
}

