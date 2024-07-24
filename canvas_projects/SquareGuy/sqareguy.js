var player = {
    x: 300,
    y: 300,
    dx: 0,
    dy: 0,
    speed: 2,

    health: 10,
    damage(amount) {
        this.health -= amount;
        document.getElementById("health").textContent = this.health;
    },

    cooldown: 0,
    direction: 0,
    resetCooldown() {
        this.cooldown = 20;
    }
}

var mouse = {
    x: 0,
    y: 0
}

function drawPlayer() {
    const pH = 10;
    const pW = 10;

    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        draw2d.fillRect(player.x-(pW/2),player.y-(pH/2), pW,pH);
    }
}

var input = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
}
//var input = [false,false,false,false];

onkeydown = (e) => {
    switch(e.code) {
        case "KeyW":
            input.up = true;
            //input[0] = true;
            //player.dy = -1;
            break;
        case "KeyA":
            input.left = true;
            //input[1] = true;
            //player.dx = -1;
            break;
        case "KeyS":
            input.down = true;
            //input[2] = true;
            //player.dy = 1;
            break;
        case "KeyD":
            input.right = true;
            //input[3] = true;
            //player.dx = 1;
            break;
        case "Space":
            input.space = true;
            console.log(player.direction);
            break;
    }
}

onkeyup = (e) => {
    switch(e.code) {
        case "KeyW":
            input.up = false;
            //input[0] = false;
            //player.dy = 0;
            break;
        case "KeyA":
            input.left = false;
            //input[1] = false;
            //player.dx = 0;
            break;
        case "KeyS":
            input.down = false;
            //input[2] = false;
            //player.dy = 0;
            break;
        case "KeyD":
            input.right = false;
            //input[3] = false;
            //player.dx = 0;
            break;
        case "Space":
            input.space = false;
            break;
    }
}

onmousemove = (e) => {
    /*var mouse = {
        x: e.offsetX,
        y: e.offsetY
    }*/
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    /*let draw2d = document.getElementById("canvas").getContext("2d");
    draw2d.beginPath();
    draw2d.arc(mouse.x,mouse.y, 10, 0.2*Math.PI, true);
    draw2d.stroke();*/

    
}

function handleInput() {
    if (input.up) {
        if (input.down)
            player.dy = 0;
        else
            player.dy = -1;
    }
    else if (input.down)
        player.dy = 1;
    else
        player.dy = 0;

    if (input.left) {
        if (input.right)
            player.dx = 0;
        else
            player.dx = -1;
    }
    else if (input.right)
        player.dx = 1;
    else
        player.dx = 0;
}



var timer = 0;
var lose = false;

function newGame() {
    spawnerList = [];
    for (let i = 0; i < Math.ceil(Math.random()*5); i++) {
        let spawn = new Spawner;
        spawn.x = Math.random() * 600;
        spawn.y = Math.random() * 600;
        spawn.firespeed = Math.ceil(Math.random() * 4);
        spawn.interval = Math.floor(Math.random()*20) + 10;
        //spawn.firespeed = 2;
        //spawn.interval = 1;
        
        spawnerList.push(spawn);
    }

    projectileList = [];
    
    lose = false;
    timer = 0;
    player.health = 10;

    loop();
}

function loop() {

    handleInput();

    // Player Movement
    if (player.dx != 0 && player.dy != 0) {
        let norm = Math.sqrt(player.dx**2 + player.dy**2);
        player.dx = player.dx / norm;
        player.dy = player.dy / norm;
    }
    player.x += player.dx * player.speed;
    player.y += player.dy * player.speed;

    // Manage player health
    if (player.health <= 0)
        lose = true;

    // Manage player firing
    player.direction = Math.atan((player.y-mouse.y) / (player.x-mouse.x));
    if (mouse.x < player.x)
        player.direction += Math.PI;
    if (player.cooldown > 0)
        player.cooldown -= 1;
    if (input.space && player.cooldown === 0) {
        var playerprojectile = new Projectile();
        playerprojectile.x = player.x;
        playerprojectile.y = player.y;
        playerprojectile.dx = Math.cos(player.direction);
        playerprojectile.dy = Math.sin(player.direction);
        playerprojectile.owner = 0;

        projectileList.push(playerprojectile);

        player.resetCooldown();
    }


    moveProjectiles();
    spawnProjectiles();

    //console.log(player);

    document.getElementById("canvas").getContext("2d").clearRect(0,0,600,600);

    drawPlayer();
    drawProjectiles();
    drawSpawners();

    timer++;

    if (!lose)
        window.requestAnimationFrame(loop);
    else
        document.getElementById("canvas").getContext("2d").fillText("You Died", 300,300);

}
