import {Loot} from './Loot.js';
export class MeleeConflict {
    constructor(game){
        this.game = game;
        this.meleeFight = false
        this.hitInterval = 2000;
        this.hitTimer = 0;
        
    }
    checkMeleeContact(a, b, deltaTime){ 
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dy,dx);
        const sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
        //console.log(distance, sumOfRadii); 
        if (distance <= sumOfRadii) {
            //Combat
            a.inCombat = true;
            b.inCombat = true;
            this.meleeFight= true;   
            if (this.hitTimer > this.hitInterval) {
                this.hitTimer = 0;
                new MeleeCombat(a,b,this.game);
            } else {
                this.hitTimer += deltaTime;
            }   
        }
        else {
            this.meleeFight = false;
            a.inCombat = false;
            b.inCombat = false;
        }
    }
    
}

class MeleeCombat {
    constructor(a,b, game){
        this.loot= new Loot();
        this.a = a;
        this.b = b;
        this.game = game;
        this.roll= 0;
        this.damageGiven = 0;
        this.damageTaken = 0;
        const missSound = new Audio('../audio/swosh-01.flac');
        const missSound2 = new Audio('../audio/swosh-04.flac');
        const hitSound1 = new Audio('../audio/5.ogg');
        
        this.enemiesInCombat = [];
       
        
        //while alive
        if ((a.hitPoints >0) && (b.hitPoints > 0)){
            a.inCombat = true;
            b.inCombat = true;
            a.state = 'Melee Combat';
            //player Tried to hit Mob
            this.roll=Math.floor(Math.random()*20 +1);
            if ( this.roll >= (20 - b.armourClass)) {
                this.damageGiven = Math.floor(Math.random() * a.weaponDamage)+1
                b.hitPoints -= this.damageGiven;
                //console.log(this.roll ,b);
                if (this.game.soundMode) hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', b);
                if (this.game.soundMode) missSound.play();
                this.damageGiven = 0;
            }
            //Mob trys to hit player
            this.roll=Math.floor(Math.random()*20 +1);
            if (this.roll >= (20 - a.armourClass)) {
                this.damageTaken = Math.floor(Math.random() * b.weaponDamage)+1
                a.hitPoints -= this.damageTaken;
                //console.log(this.roll,a);
                if (this.game.soundMode) hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', a)
                this.damageTaken = 0;
                if (this.game.soundMode) missSound2.play();
            }
            // display Damage 
            this.game.hitUI.updateData(a, this.damageTaken, b ,this.damageGiven);
            //check for Win
            if (b.hitPoints <= 0 ){
                a.experiance += b.experiance;
                a.coins+= b.coins;
                document.getElementById('coin-count').innerHTML = `${a.coins}`;
                b.markedForDeletion = true;
                a.victories++;
                a.inCombat = false;
                a.state='adventuring';
                if (this.game.soundMode) b.deathSound.play();
                this.loot.getPotionLoot(a);
                console.log(b);
                
                
            } 
            if (a.hitPoints <= 0) {
                a.state='ko';
                a.knockOuts++;
                a.experiance -= Math.floor(b.experiance * 0.5);
                // runs off with some loot
                const coinTaken = Math.floor(a.coins *.3);
                a.coins-= coinTaken;
                b.coins += coinTaken;
                //lives reduced
                a.lives--;
                a.hitPoints = a.maxHitPoints;
                b.x = Math.floor(Math.random() * this.game.WIDTH);
                b.y = Math.floor(Math.random() * this.game.HEIGHT);
                a.inCombat = false;
                b.inCombat = false;
                b.markedForDeletion = true;
                if (this.game.soundMode) a.deathSound.play();
            }            
        } 
    }       
    addCombatant(enemy){
        enemiesInCombat.push(enemy);
    }
    removeDead(){
        this.enemiesInCombat = this.enemiesInCombat.filter(enemy => !enemy.markedForDeletion);
    }
    updateTurn(){
        for (let i = 0 ; i < this.game.player.attacks; i++){
            //player Tried to hit Mob
            this.roll=Math.floor(Math.random()*20 +1);
            if ( this.roll >= (20 - b.armourClass)) {
                this.damageGiven = Math.floor(Math.random() * this.game.player.weaponDamage)+1
                this.enemiesInCombat[0].hitPoints -= this.damageGiven;
                //console.log(this.roll ,b);
                if (this.game.soundMode) hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', b);
                if (this.game.soundMode) missSound.play();
                this.damageGiven = 0;
            }
            if (this.enemiesInCombat[0].hitPoints <= 0 ){
                this.game.player.experiance += e.experiance;
                this.game.player.coins+= e.coins;
                document.getElementById('coin-count').innerHTML = `${a.coins}`;
                e.markedForDeletion = true;
                this.game.player.victories++;
                this.game.player.coins += this.enemiesInCombat[0].coins;
                if (this.game.soundMode) b.deathSound.play();
                this.loot.getPotionLoot(a);


                if (this.enemiesInCombat.length > 0){
                    this.removeDead();
                }
            }
        }
        this.enemiesInCombat.forEach((e)=> {
            //Mob trys to hit player
            this.roll=Math.floor(Math.random()*20 +1);
            if (this.roll >= (20 - this.game.player.armourClass)) {
                this.damageTaken = Math.floor(Math.random() * e.weaponDamage)+1
                this.game.player.hitPoints -= this.damageTaken;
                //console.log(this.roll,a);
                if (this.game.soundMode) hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', a)
                this.damageTaken = 0;
                if (this.game.soundMode) missSound2.play();
            }
            // display Damage 
            this.game.hitUI.updateData(this.game.player, this.damageTaken, e ,this.damageGiven);
            this.damageGiven = 0;
            //Enemie killed

        });
    }
    playerStatusCheck(){
        //check for Win
        if (this.enemiesInCombat.length > 0){
            this.game.player.inCombat = true;
            this.game.player.state='Melee Combat';
        } else {
            this.game.player.inCombat = false;
            this.game.player.state='adventuring';
            console.log(b);     
        }
        if (this.game.player.hitPoints <= 0) {
            this.game.player.state='ko';
            this.game.player.knockOuts++;
            this.game.player.experiance -= Math.floor(b.experiance * 0.5);
            // runs off with some loot
            const coinTaken = Math.floor(this.game.player.coins *.3);
            this.game.player.coins-= coinTaken;
            //lives reduced
            this.game.player.lives--;
            this.game.player.hitPoints = this.game.player.maxHitPoints;
            this.game.player.inCombat = false;  
            if (this.game.soundMode) this.game.player.deathSound.play();
            //all enemies in melee removed
            this.enemiesInCombat.forEach((e)=>{
                e.markedForDeletion= true;
            })
        }    
             
            
        
    }

}