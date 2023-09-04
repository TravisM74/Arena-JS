import {Game} from './scripts/game.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1000;
const CANVAS_HEIGHT = canvas.height = 1000;


const game = new Game(CANVAS_WIDTH,CANVAS_HEIGHT);
let lastTime= 0;

function animate(timeStamp) {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.draw(ctx);
    game.update(timeStamp,deltaTime);
   
    requestAnimationFrame(animate);
}
animate(0);