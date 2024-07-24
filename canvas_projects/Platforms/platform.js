class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        
        this.coyotetime = 5;
    }
}

var player = {
    jump: 5,
    width: 5,
    height: 10,
    
    x: 0,
    y: 0,
    x_prev: 0,
    y_prev: 0,
    dx: 0,
    dy: 0,
    xcceleration: 0,
    dx_max: 2,
    dx_platform: 0,

    grounded: false,
    current_platform: {type: 0, index: 0},

    airjump: 2,
    airjump_max: 2,
    jump_release: false,

    horz_mult: 1
}

function checkLanding() {
    if (player.y > 500 - (player.height/2)) {
        player.dy = 0;
        player.y = 500 - (player.height/2);
        player.grounded = true;
        player.airjump = player.airjump_max;
        player.current_platform.type = 0;
        player.current_platform.index = 0;
    }
    else {
        for (let i = 0; i < platformList.length; i++) {
            var plat = platformList[i];
            if (player.x+(player.width/2) > plat.x-(plat.width/2)-plat.coyotetime &&
                player.x-(player.width/2) < plat.x+(plat.width/2)+plat.coyotetime &&
                player.dy >= 0 &&
                (player.y_prev+(player.height/2) < plat.y && player.y+(player.height/2) >= plat.y)) {
                player.dy = 0;
                player.y = plat.y - (player.height/2);
                player.grounded = true;
                player.airjump = player.airjump_max;
                player.current_platform.type = 1;
                player.current_platform.index = i;
            }
        }
    }
}

function checkFalling() {
    if (player.current_platform.type === 1)
        var plat = platformList[player.current_platform.index];
    if (player.current_platform.type === 2)
        var plat = platformDList[player.current_platform.index];
    if (player.current_platform.type === 3)
        var plat = platformMList[player.current_platform.index];

    if (player.x > plat.x+(plat.width/2) || player.x < plat.x-(plat.width/2)) {
        player.grounded = false;
        player.current_platform.type = 0;
        player.current_platform.index = 0;
    }
}


function movePlayer() {

    if (!player.grounded) {
        player.dy += 0.2;
        checkLanding();
        checkLandingDiagonal();
        checkLandingMoving();
    }
    else {
        if (player.current_platform.type > 0)
            checkFalling();
        if (player.current_platform.type === 2) {
            let angle = platformDList[player.current_platform.index].angle;
            player.dy = -1 * Math.sin(angle) * player.dx;
        }
        if (player.current_platform.type === 3) {
            let plat = platformMList[player.current_platform.index];
            if (plat.direction === 0)
                player.y = plat.y - (player.height/2);
            player.dx_platform = plat.travelvect[0] * plat.speed * plat.direction;
            player.dy = plat.travelvect[1] * plat.speed * plat.direction;
        }
        else
            player.dx_platform = 0;
    }

    checkWalls();
    
    player.x_prev = player.x;
    player.y_prev = player.y;

    if (Math.abs(player.dx) < player.dx_max)
        player.dx += player.xcceleration;
    if (Math.abs(player.dx) < 0.001)
        player.dx = 0;

    player.y += player.dy;
    player.x += player.dx * player.horz_mult + player.dx_platform;
}




    
var inputs = {
    left: false,
    right: false,
    jump: false,
}
onkeydown = (e) => {
    if (e.code === "ArrowRight")
        inputs.right = true;
    if (e.code === "ArrowLeft")
        inputs.left = true;
    if (e.code === "ArrowUp")
        inputs.jump = true;
    if (e.code === "KeyF") {
        console.log(player);
    }
}
onkeyup = (e) => {
    if (e.code === "ArrowRight")
        inputs.right = false;
    if (e.code === "ArrowLeft")
        inputs.left = false;
    if (e.code === "ArrowUp")
        inputs.jump = false;
}
function handleInputs() {

    // Left-Right Movement
    if (inputs.left) {
        if (inputs.right)
            player.xcceleration = 0;
        else
            player.xcceleration = -0.1;
    }
    else if (inputs.right) {
        player.xcceleration = 0.1;
    }
    else {
        player.xcceleration = 0;
        if (player.dx > 0)
            player.dx *= 0.85;
        if (player.dx < 0)
            player.dx *= 0.85;
    }
    
    // Jump
    if (inputs.jump && player.airjump > 0 && player.jump_release) {
        player.dy = -1 * player.jump;
        player.airjump--;
        player.grounded = false;
        player.jump_release = false;
    }
    if (!inputs.jump)
        player.jump_release = true;
}






function drawPlayer() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");
        
        draw2d.fillRect(player.x-(player.width/2), player.y-(player.height/2), player.width,player.height);
        
    }
}

function drawPlatforms() {

    const canvas = document.getElementById("canvas");
    var draw2d = canvas.getContext("2d");

    draw2d.beginPath();
    for (let i = 0; i < platformList.length; i++) {
        let plat = platformList[i];

        //if (plat.x is in view && plat.y is in view)
        draw2d.moveTo(plat.x-(plat.width/2), plat.y);
        draw2d.lineTo(plat.x+(plat.width/2), plat.y);
    }
    draw2d.stroke();
}

function drawGround() {

    const canvas = document.getElementById("canvas");
    var draw2d = canvas.getContext("2d");
    
    draw2d.beginPath();
    draw2d.moveTo(0,500);
    draw2d.lineTo(800,500);
    draw2d.stroke();
}

function drawBackground() {
    const canvas = document.getElementById("canvas");
    var draw2d = canvas.getContext("2d");
    
    draw2d.clearRect(0,0, 800,600);
}








var platformList = [];

function startGame() {
    let platform = new Platform(300,400, 100);
    platformList.push(platform);
    let platform2 = new Platform(400,300, 50);
    platformList.push(platform2);
    let platform3 = new Platform(300,200, 10);
    platformList.push(platform3);
    let platform4 = new Platform(100,150, 10);
    platformList.push(platform4);

    let wall = new Wall(600,400, 200);
    wallList.push(wall);

    let dplatform = new PlatformDiagonal(650,400, 50, -1*Math.PI/4);
    platformDList.push(dplatform);
    let mplatform = new PlatformMoving(700,300, 550,100, 50, 5);
    platformMList.push(mplatform);
    
    console.log(platformList);

    loop();
}

function loop() {

    handleInputs();
    movePlayer();
    movePlatforms();

    drawBackground();
    drawGround();
    drawPlatforms();
    drawWalls();
    drawPlatformsDiagonal();
    drawPlatformsMoving();
    drawPlayer();
    

    window.requestAnimationFrame(loop);

}
