export class InputHandler{
    constructor(game){
        this.keys = [];
        this.game = game;
        window.addEventListener('keydown', e =>{
            if((    e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowRight' || 
                    e.key === 'ArrowLeft'||
                    e.key ==='Enter' 
                ) && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                } else {
                    if (e.key === 'd') this.game.debugMode = !this.game.debugMode ;
                    if (e.key === 'r') this.game.player.state='resting';
                }
        });
        window.addEventListener('keyup', e =>{
            if( e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' || 
                e.key === 'ArrowRight' || 
                e.key === 'ArrowLeft' ||
                e.key ==='Enter' ){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }  
        });
        
    }
}