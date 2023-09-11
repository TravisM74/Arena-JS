import {ItemGain} from './hitUI.js';
export class Loot {
    constructor(game){
        this.game= game;
        
    }
    getPotionLoot(player){
        if (Math.random() < 0.20) {
            player.healthPotions++;
            document.getElementById('health-pot-charges').innerText=`${player.healthPotions}`;
            this.game.displayHits.push(new ItemGain(this.game.player, '+1 Potion'));
            if (this.game.soundMode) this.game.takeSound.play();
        }
    }
    checkArmourUpgradeLoot(player){
        if (Math.random() < 0.05) {
            this.game.displayHits.push(new ItemGain(this.game.player, 'AC Improve')); 
            player.armourClass--;
            document.getElementById('armour-class').innerHTML = player.armourClass;
        }
    }
}