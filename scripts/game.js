import {Player} from './player.js';
import {InputHandler} from './input.js';
import {DebugUI} from './debugUI.js';
import {Enemy, Skeleton} from './Enemy.js';
import {MeleeCombat2} from './meleeconflict.js'
import {HitUI} from './hitUI.js';
import {PlayerUI} from './playerUI.js';
import {EnemyUI} from './enemyUI.js';
export class Game {
    constructor(Canvas_Width, Canvas_Height){
        this.HEIGHT = Canvas_Height;
        this.WIDTH = Canvas_Width;
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.debugUI = new DebugUI(this);
        this.playerUI = new PlayerUI(this);
      
        this.gameSpeed = 1;
        this.debugMode = true; 
        // sounds off by default 
        this.soundMode = false;
        this.enemyCount = 1
        this.enemies = [];
        this.displayHits = [];

        this.gameOver = false;
        this.meleeCombat = new MeleeCombat2(this);
        

        const restButton = document.getElementById('rest-button');
        restButton.onclick = (() => this.player.state='resting'); 
        const healthPotionButton = document.getElementById('health-potion-button');
        healthPotionButton.onclick = (()=> this.player.healWithPotion())
       
    }
    update(timeStamp,deltaTime){  
        this.player.update(deltaTime);
        this.debugUI.update(timeStamp);
        this.playerUI.update();
        // end game condition
        if (this.player.lives === 0) this.gameOver= true;
        
        // clearing arrays
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        this.displayHits = this.displayHits.filter(d => !d.markedForDeletion);
        // updating displayHits
        this.displayHits.forEach((d) => {
            d.update(deltaTime);
        });

        /* //handeling player defeat
        if ((this.player.state === 'ko')||(this.player.state === 'resting' ) ){
            this.player.playerResting(deltaTime);
        }  */
       
        //Adding Enemeies
        if(this.enemies.length < 1){
            this.addSkeletonEnemies();
            //console.log(this.checkContact(this.player,this.enemies));
        };
        //Enemy Update
        this.enemies.forEach((e)=> {
            if (!e.inCombat) e.update(deltaTime);
            
        });

        //meleeCombatCheck
        this.enemies.forEach((e)=>{
            //this.meleeConflict.checkMeleeContact(this.player, e, deltaTime);
            this.meleeCombat.checkMeleeContact(this.player, e);
            if(this.meleeCombat.enemiesInCombat.length > 0 ){
                this.player.inCombat = true;
                this.player.state='melee combat'
                if (this.player.attackTimer > this.player.attackInterval){
                    this.meleeCombat.playerAttack();
                    this.player.attackTimer = 0;
                } else {
                    this.player.attackTimer += deltaTime;
                }
                this.meleeCombat.enemiesInCombat.forEach ((e)=>{
                    if (e.attackTimer > e.attackInterval) {
                        this.meleeCombat.enemyAttack(e);
                        e.attackTimer=0;
                    } else {
                        e.attackTimer += deltaTime;
                    }
                });         
            } else {
                this.player.inCombat = false;    
            }
        });
        this.meleeCombat.playerStatusCheck();
        
        
        
    }
    draw(ctx){
        this.player.draw(ctx);
        this.enemies.forEach( (e) => {
            e.draw(ctx)});
        //this.hitUI.draw(ctx);
        this.playerUI.draw(ctx);
        /* this.enemyUI.draw(ctx); */
        if (this.debugMode) this.debugUI.draw(ctx);
        // updating displayHits
        this.displayHits.forEach((d) => {
            d.draw(ctx);
        });

    }
    addSkeletonEnemies(){
        for(let i = 0 ; i < this.enemyCount ; i++){
            this.enemies.push(new Skeleton(this));   
        }
        document.getElementById('wave-count').innerText= `Wave :${this.enemyCount}`;
        this.enemyCount++;
        
    }
    checkContact(a,b){
        const dx = a.x - b.x;
       const dy = a.y - b.y;
       const distance = Math.hypot(dy,dx);
       const sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
       return [distance < sumOfRadii, a ,b];
   }
    
}