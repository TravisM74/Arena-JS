import {Player} from './player.js';
import {InputHandler} from './input.js';
import {DebugUI} from './debugUI.js';
import {Enemy, Skeleton} from './Enemy.js';
import {MeleeCombat2} from './meleeconflict.js'
import {HitUI, HealUI, ItemGain} from './hitUI.js';
import {PlayerUI} from './playerUI.js';
import {EnemyUI} from './enemyUI.js';
import {Potion}  from './items.js';
import {Loot} from './Loot.js';

import {WaveWindow} from './waveWindow.js';
import {GameOverWindow} from './gameOverWindow.js'

export class Game {
    constructor(Canvas_Width, Canvas_Height){
        this.HEIGHT = Canvas_Height;
        this.WIDTH = Canvas_Width;
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.debugUI = new DebugUI(this);
        this.playerUI = new PlayerUI(this);
        this.waveWindow = new WaveWindow(this);
        this.gameOverWindow = new GameOverWindow(this);
        this.loot= new Loot(this);
      
        this.gameSpeed = 1;
        this.debugMode = false; 
        this.soundMode = true;

        this.waveWindowTimer = 0;
        this.waveWindowInterval = 4000;
       
        this.reset();
        
        this.meleeCombat = new MeleeCombat2(this);
        
        this.buttonConfig();
        this.audioConfig();  
    }
   
    update(timeStamp,deltaTime){   
        this.player.update(deltaTime);
        this.debugUI.update(timeStamp);
        this.playerUI.update();
        // end game condition
        if (this.player.lives === 0){
            this.gameOver= true;
            this.gamePause= true;  
            this.loseSound.play();
        } 
        
        this.clearMarkedForDelete();
        //items
        this.itemSpawning(deltaTime); 
        this.items.forEach((item) => item.update(deltaTime));
        
        // updating displayHits
        this.displayHits.forEach((d) => {
            d.update(deltaTime);
        });
        
        //Enemy Update
        this.enemies.forEach((e)=> {
            if (!e.inCombat) e.update(deltaTime); 
        });
        
        this.handlingPlayerRestingState(deltaTime);
        this.addingEnemiesCheck();
        this.meleeCombatCheck(deltaTime); 
        // handle Particles
        this.particles.forEach((p)=> {p.update(deltaTime);            
        });
        this.hitParticles.forEach((p)=> {p.update(deltaTime);            
        });
        //handle Windows updates
        this.waveWindow.update(deltaTime);
        this.gameOverWindow.update(deltaTime);
        if((this.enemies.length === 0)&&(this.gamePause) && (!this.gameOver)){
        this.waveWindowTimer += deltaTime;
        }
        
    }
    draw(ctx){
        //this.hitUI.draw(ctx);
        this.playerUI.draw(ctx);
        this.particles.forEach((p) => {p.draw(ctx);
        });

        if (this.debugMode) this.debugUI.draw(ctx);
        this.player.draw(ctx);
        
        /* this.enemyUI.draw(ctx); */
        this.enemies.forEach( (e) => {
            e.draw(ctx)});
        // updating displayHits
        this.displayHits.forEach((d) => {
            d.draw(ctx);
        });
        this.items.forEach((item) => item.draw(ctx));
        // handle Particles
        this.hitParticles.forEach((p)=> {p.draw(ctx);});

        //Wave Window Display 
        if (this.player.lives === 0){
            this.gameOverWindow.draw(ctx);
        }  
        if((this.enemies.length === 0)&&(this.gamePause) && (!this.gameOver) && (this.waveWindowTimer > this.waveWindowInterval)){
            
            this.waveWindow.draw(ctx);
        }

    }

    reset(){
        this.enemyCount = 1
        this.enemies = [];
        this.displayHits = [];
        
        this.items = [];
        this.itemTimer = 0;
        this.itemInterval = 5000;
            
       this.particles = [];
       this.hitParticles =[];

        this.gameOver = false;
        this.gamePause = false;
    }
    buttonConfig(){
        const restButton = document.getElementById('rest-button');
        restButton.onclick = (() => this.player.state='resting'); 
        const healthPotionButton = document.getElementById('health-potion-button');
        healthPotionButton.onclick = (()=> this.player.healWithPotion());
    }
    audioConfig(){
        this.potionSpawnSound = new Audio('../audio/bubble.wav');
        this.takeSound = new Audio('../audio/take.wav');
        this.loseSound = new Audio('../audio/lose.wav');
       
    }
    handlingPlayerRestingState(deltaTime){
        if ((this.player.state === 'ko')||(this.player.state === 'resting' )&&(this.enemies.length > 0) ){
            this.player.playerResting(deltaTime);
        } 
        
    }
    addingEnemiesCheck(){
        if((this.enemies.length < 1) &&(!this.gamePause )){
            this.addNewEnemies();
            this.gamePause = true;
            //console.log(this.checkContact(this.player,this.enemies));
        };
    }
    addNewEnemies(){
        for(let i = 0 ; i < this.enemyCount ; i++){
            this.enemies.push(new Skeleton(this, 1));   
        }
        document.getElementById('wave-count').innerText= `Wave :${this.enemyCount}`;
        this.enemyCount++;
        
    }
    
    meleeCombatCheck(deltaTime){
        this.enemies.forEach((e)=>{
            this.meleeCombat.checkMeleeContact(this.player, e);
            if(this.meleeCombat.enemiesInCombat.length > 0 ){
                this.player.inCombat = true;
                this.player.state='melee combat';             
            } else {
                this.player.inCombat = false; 
                this.player.attackTimer = 0;   
            }
        });
        if ((this.player.attackTimer > this.player.attackInterval)&&(this.player.inCombat)){
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
        this.meleeCombat.playerStatusCheck();
    }
    
    clearMarkedForDelete(){
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        this.displayHits = this.displayHits.filter(d => !d.markedForDeletion);
        this.items = this.items.filter(d => !d.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        this.hitParticles = this.hitParticles.filter(p => !p.markedForDeletion);
    }
    checkDistance(a,b){
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dy,dx);
        const sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
        return [(distance < sumOfRadii)];
    }
   checkcollision(a,b){
       const dx = a.x - b.x;
       const dy = a.y - b.y;
       const distance = Math.hypot(dy,dx);
       const sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
       return [(distance < sumOfRadii),distance, sumOfRadii, dx ,dy];
    }
    
    
    itemSpawning(deltaTime){
        if (this.itemTimer > this.itemInterval) {
            this.itemTimer = 0;
            if ((Math.random() < .10)&&(this.enemies.length > 0)) {
                this.newItem= new Potion(this);
                
                this.items.push(this.newItem) ;
                if (this.soundMode) this.potionSpawnSound.play();
            } 
        } else {
            this.itemTimer += deltaTime;
        }
    }
  
    
}