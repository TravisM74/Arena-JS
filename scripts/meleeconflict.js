import {Loot} from './Loot.js';
export class MeleeConflict {
    constructor(game){
        this.game = game;
        this.meleeFight = false
        this.hitInterval = 2000;
        this.hitTimer = 0;
        
    }
    update(a, b, deltaTime){
        
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dy,dx);
        const sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
        console.log(distance, sumOfRadii);
        if (distance <= sumOfRadii) {
            //Combat
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
                hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', b);
                missSound.play();
                this.damageGiven = 0;
            }
            //Mob trys to hit player
            this.roll=Math.floor(Math.random()*20 +1);
            if (this.roll >= (20 - a.armourClass)) {
                this.damageTaken = Math.floor(Math.random() * b.weaponDamage)+1
                a.hitPoints -= this.damageTaken;
                //console.log(this.roll,a);
                hitSound1.play();
            } else {
                //console.log(this.roll, 'miss', a)
                this.damageTaken = 0;
                missSound2.play();
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
                b.deathSound.play();
                this.loot.getPotionLoot(a);
                
                
            } 
            if (a.hitPoints <= 0) {
                a.state='ko';
                a.knockOuts++;
                a.experiance -= Math.floor(b.experiance * 0.5);
                // runs off with some loot
                const coinTaken = Math.floor(a.coins *.3);
                a.coins-= coinTaken;
                b.coins += coinTaken;
                b.x = Math.floor(Math.random() * this.game.WIDTH);
                b.y = Math.floor(Math.random() * this.game.HEIGHT);
                a.inCombat = false;
                b.inCombat = false;
                a.deathSound.play();
                b.markedForDeletion = true;
            }            
        } 
    }       

}