export class Loot {
    constructor(){
        
        
    }
    getPotionLoot(player){
        if (Math.random() < 0.33) {
            player.healthPotions++;
            document.getElementById('health-pot-charges').innerText=`${player.healthPotions}`;
        }
    }
}