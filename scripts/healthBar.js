export class HealthBar {
    constructor(entity){
        this.entity = entity;
    }
    draw(ctx){
        //health Bar
        ctx.fillStyle = 'black'
        this.barWidth = (this.entity.width *2 )/ this.entity.maxHitPoints;
        for (let i = 0; i < this.entity.maxHitPoints;i++){
            ctx.fillRect((this.entity.x - this.entity.width + (this.barWidth * i)), this.entity.y -this.entity.height +5, this.barWidth, 5);
        }
        ctx.fillStyle = 'red'
        for (let i = 0; i < this.entity.hitPoints;i++){
            ctx.fillRect((this.entity.x - this.entity.width + (this.barWidth * i)), this.entity.y -this.entity.height +4, this.barWidth, 5);
        }
        ctx.fillStyle = 'black'
    }
}