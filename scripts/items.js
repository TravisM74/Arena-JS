class Items {
    constructor(game){
        this.game = game;
        this.pickupRadius = 5;
        this.x = (Math.random()* this.game.WIDTH);
        this.y = Math.random()* this.game.HEIGHT;
        this.height = 62;
        this.width = 62;
        this.markedForDeletion = false;
        this.takeSound = new Audio('../audio/take.wav');

    }
    draw(ctx){
        ctx.fillStyle ='blue';
        ctx.fillRect(this.x, this.y , this.width, this.height)
    }
    update(deltaTime){
        //item detection
        this.game.items.forEach((item) => {
            this.playerlocation = this.game.checkDistance(this.game.player, item);
            if (this.playerlocation[0] < (this.game.player.meleeCombatRadius + item.pickupRadius)){
                //picked up
                item.activate();
                if (this.game.soundMode) this.takeSound.play();
                item.markedForDeletion = true;
            }
        });
        
    }
    
}
export class Potion extends Items {
    constructor(game){
        super(game);
        this.name = 'Healing potion';
        this.quantity = 1;
        this.image = document.getElementById('health-potion-image')
        this.spawnPercent = 0.5;
        this.spawnSound = new Audio('../audio/bottle.wav');
       
    }
    activate(){
        this.game.player.collectHealthPotion();
    }
    draw(ctx){
        ctx.drawImage(this.image, this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
    }
    update(deltaTime){
        super.update(deltaTime);
    }

}