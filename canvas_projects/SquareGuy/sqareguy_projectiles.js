/*var projectile = {
    x: 0,
    y: 0,

    dx: 0,
    dy: 0,

    speed: 0
}*/
class Projectile {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.owner = 0;
    }
}

/*var spawner = {
    x: 0,
    y: 0,

    direction: 0,
    firespeed: 3,

    interval: 200
}*/
class Spawner {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.firespeed = 0;
        this.interval = 0;

        this.health = 5;
    }

    damage(amount) {
        this.health -= amount;
    }
}

class Spawner2 extends Spawner{
    constructor() {
        this.firespeed = 5;
        this.interval = 100;
    }
    /*predictMovement() {
        
    }*/
}

var projectileList = [];

function moveProjectiles() {
    for (let i = 0; i < projectileList.length; i++) {
        let proj = projectileList[i];

        proj.x += proj.dx;
        proj.y += proj.dy;

        if (proj.x > 600 || proj.x < 0 || proj.y > 600 || proj.y < 0)
            projectileList.splice(i,1);

        if (proj.owner === 0) {
            for (let i = 0; i < spawnerList.length; i++) {
                let checkspawn = spawnerList[i];
                if (Math.sqrt((proj.x-checkspawn.x)**2 + (proj.y-checkspawn.y)**2) < 10) {
                    projectileList.splice(i,1);
                    checkspawn.damage(1);
                    if (checkspawn.health <= 0)
                        spawnerList.splice(i,1);
                }
            }
        }
        if (proj.owner === 1) {
            if (Math.abs(proj.x - player.x) < 5 && Math.abs(proj.y - player.y) < 5) {
                projectileList.splice(i,1);
                player.damage(1);
                //console.log(player.health);
            }
        }

    }
}

function drawProjectiles() {
    for (let i = 0; i < projectileList.length; i++) {
        let proj = projectileList[i];
        const canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            var draw2d = canvas.getContext("2d");

            draw2d.beginPath();
            draw2d.arc(proj.x,proj.y, 2, 0,2*Math.PI, true);
            draw2d.fill();
        }
    }
}

var spawnerList = [];

function spawnProjectiles() {
    for (let i = 0; i < spawnerList.length; i++) {
        let spawn = spawnerList[i];

        let dir = [spawn.x - player.x, spawn.y - player.y];
        let angle = Math.atan(dir[1]/dir[0]);
        if (spawn.x > player.x)
            angle += Math.PI;
        
        spawn.direction = angle;

        if (timer % spawnerList[i].interval === 0) {
            let proj = new Projectile;

            proj.x = spawn.x;
            proj.y = spawn.y;
            proj.dx = Math.cos(spawn.direction) * spawn.firespeed;
            proj.dy = Math.sin(spawn.direction) * spawn.firespeed;
            proj.owner = 1;

            projectileList.push(proj);
            console.log(projectileList.length);
        }
            
    }
}

function drawSpawners() {
    for (let i = 0; i < spawnerList.length; i++) {
        let spawn = spawnerList[i];

        const draw2d = document.getElementById("canvas").getContext("2d");
        draw2d.beginPath();
        draw2d.arc(spawn.x,spawn.y, 10, 0,2*Math.PI, true);
        draw2d.fill();

        
        draw2d.beginPath();
        draw2d.moveTo(spawn.x,spawn.y);
        draw2d.lineTo(spawn.x + (Math.cos(spawn.direction)*15), spawn.y + (Math.sin(spawn.direction)*15));
        draw2d.stroke();
    }
}

/*
for (let i = 0; i < Math.ceil(Math.random()*5); i++) {
    let spawn = new Spawner;
    spawn.x = Math.random() * 600;
    spawn.y = Math.random() * 600;
    spawn.firespeed = Math.ceil(Math.random() * 4);
    spawn.interval = Math.floor(Math.random()*20) + 10;
    
    spawnerList.push(spawn);
}
*/
