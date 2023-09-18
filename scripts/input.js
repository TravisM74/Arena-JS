export class InputHandler{
    constructor(game){
        this.keys = [];
        this.game = game;
        window.addEventListener('keydown', e =>{
            if((    e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowRight' || 
                    e.key === 'ArrowLeft'||
                    e.key === 'w'||
                    e.key === 'a'||
                    e.key === 's'||
                    e.key === 'd'
                    
                    ) && this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } else {
                        if (e.key === 't') this.game.debugMode = !this.game.debugMode ;
                        if (e.key === 'm') this.game.soundMode = !this.game.soundMode ;
                        if (e.key === 'r') this.game.player.state='resting';
                        if (((e.key === 'r') && ((this.game.gameOver) || (this.game.gameWin)))) {
                            this.game.player.reset(); 
                            this.game.reset();  
                        }
                        if ((e.key === 'p')&&(this.game.player.hitPoints !== this.game.player.maxHitPoints)) {
                            this.game.player.healWithPotion();
                        }
                      
                        if ((e.key === ' ') && (!this.game.gameWin)) {
                            /* this.game.wavePause = !this.game.wavePause; */
                            this.game.addNewEnemies();
                            if(this.game.player.defeatedInCombat) this.game.player.defeatedInCombat = !this.game.player.defeatedInCombat;
                            this.game.waveWindowTimer = 0;
                        }
                   
                }
        });
        window.addEventListener('keyup', e =>{
            if( e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' || 
                e.key === 'ArrowRight' || 
                e.key === 'ArrowLeft' ||
                e.key === 'w'||
                e.key === 'a'||
                e.key === 's'||
                e.key === 'd'
                ){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }  
        });
        
    }
}