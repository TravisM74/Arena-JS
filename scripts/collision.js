export class Collision {
    constructor(a,b){
        this.a = a;
        this.b = b;
       
    }
    checkContact(a,b){
         const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dy,dx);
        const sumOfRadii = a.meleeCombatRadius + b.meleeCombatRadius ;
        return (distance < sumOfRadii), a ,b;
    }
}