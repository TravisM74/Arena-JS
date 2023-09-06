import {Loot} from './Loot.js';
import {HitUI} from './hitUI.js';

export class MeleeCombat2 {
    constructor(game){
        this.loot= new Loot();
        this.game = game;
        this.enemiesInCombat = [];
        this.missSound = new Audio('../audio/swosh-01.flac');
        this.missSound2 = new Audio('../audio/swosh-04.flac');
        this.hitSound1 = new Audio('../audio/5.ogg');
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
            if (( this.roll >= (20 - this.enemiesInCombat[0].armourClass)) && (this.enemiesInCombat.length >0)) {
                this.damage = Math.floor(Math.random() * this.game.player.weaponDamage)+1;
                this.enemiesInCombat[0].hitPoints -= this.damage;
                //display hit
                this.game.displayHits.push(new HitUI(this.game.player, this.enemiesInCombat[0], this.damage));
                //console.log(this.roll ,b);
                if (this.game.soundMode) this.hitSound1.play();
                this.removeDead();
            } else {
                //console.log(this.roll, 'miss', b);
                if (this.game.soundMode) this.missSound.play();
                this.damage = 0;
                //display Miss
                this.game.displayHits.push(new HitUI(this.game.player, this.enemiesInCombat[0], this.damage));
            }
            //check if Enemy got killed
            if (this.enemiesInCombat[0].hitPoints <= 0 ){
                this.game.player.experiance += this.enemiesInCombat[0].experiance;
                this.game.player.coins+= this.enemiesInCombat[0].coins;
                document.getElementById('coin-count').innerHTML = `${this.game.player.coins}`;
                this.enemiesInCombat[0].markedForDeletion = true;
                this.game.player.victories++;
                if (this.game.soundMode) this.enemiesInCombat[0].deathSound.play();
                this.loot.getPotionLoot(this.game.player);
                this.game.player.state ='adventuring';
                if (this.enemiesInCombat.length > 0){
                    this.removeDead();
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
                // check is player renderd unconcious
                if ((this.game.player.hitPoints < 1 ) &&( !this.game.player.state === 'ko')) {
                    this.game.player.experiance -= Math.floor(this.e.experiance * 0.5);
                    this.game.player.state='ko'
                    this.game.player.knockOuts++;
                    
                } 
                //console.log(this.roll,a);
                if (this.game.soundMode) this.hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', a)
                this.damageTaken = 0;
                if (this.game.soundMode) this.missSound2.play();
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
            this.game.enemyCount--;
            if (this.game.soundMode) this.game.player.deathSound.play();
            //all enemies in melee removed
            this.enemiesInCombat.forEach((e)=>{
                e.markedForDeletion= true;
            });
            this.removeDead();
        }          
        
    }
}

