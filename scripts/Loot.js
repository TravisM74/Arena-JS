import {ItemGain} from './hitUI.js';
export class Loot {
    constructor(game){
        this.game= game;
        this.ACbuffCount = 2;
        this.strengthBuffcount = 4;
        this.speedBuffCount = 5;
        
        this.upgradeSound = new Audio('../audio/upgrade.wav');
        
    }
    getLoot(){
        this.getPotionLoot();
        this.checkArmourUpgradeLoot();
        this.strengthBuff();
        this.speedBuff();

    }
    getPotionLoot(){
        if (Math.random() < 0.1) {
            this.game.player.healthPotions++;
            document.getElementById('health-pot-charges').innerText=`${this.game.player.healthPotions}`;
            this.game.displayHits.push(new ItemGain(this.game.player, '+1 Potion'));
            if (this.game.soundMode) this.game.takeSound.play();
        }
    }
    checkArmourUpgradeLoot(){
        if ((Math.random() < 0.04 ) &&(this.ACbuffCount > 0 )) {
            if (this.game.soundMode) this.upgradeSound.play();
            this.game.displayHits.push(new ItemGain(this.game.player, 'AC Improved')); 
            this.game.player.armourClass--;
            this.ACbuffCount--;
            document.getElementById('armour-class').innerHTML = this.game.player.armourClass;
        }
    }
    strengthBuff(){
        if ((Math.random() < 0.04 ) &&(this.strengthBuffcount > 0 )) {
            if (this.game.soundMode) this.upgradeSound.play();
            this.game.player.bonusDamage++;
            this.strengthBuffcount--;
            this.game.displayHits.push(new ItemGain(this.game.player, 'Strength Improved')); 
            console.log(this.strengthBuffcount);
            switch (this.strengthBuffcount){
                case 3 :
                    document.getElementById('strength').innerHTML=('Strength: Peek');
                    break;
                case 2 :
                    document.getElementById('strength').innerHTML=('Strength: Orc Like');
                    break;
                case 1 :
                    document.getElementById('strength').innerHTML=('Strength: Giant Like');
                    break;
                case 0 :
                    document.getElementById('strength').innerHTML=('Strength: Diety Like');
                    break;
            }

        }
    }
    speedBuff(){
        if ((Math.random() < 0.03 ) &&(this.strengthBuffcount > 0 )) {
            if (this.game.soundMode) this.upgradeSound.play();
            this.game.player.attackInterval -= 100;
            this.speedBuffCount--;
            this.game.displayHits.push(new ItemGain(this.game.player, 'Attack Speed Improved')); 
        }
        switch (this.speedBuffCount){
            case 3 :
                document.getElementById('speed').innerHTML=('Speed: Peek condition');
                break;
            case 2 :
                document.getElementById('speed').innerHTML=('Speed: Orc Like');
                break;
            case 1 :
                document.getElementById('speed').innerHTML=('Speed: Giant Like');
                break;
            case 0 :
                document.getElementById('speed').innerHTML=('Speed: Diety Like');
                break;
        }

    }
    
}