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

    dx_physics: 0,
    //dy_physics: 0,

    grounded: false,
    current_platform: {type: 0, index: 0},

    airjump: 2,
    airjump_max: 2,
    jump_release: false,

    horz_mult: 1
}


function checkFalling() {
    if (player.current_platform.type === 1)
        var plat = game.levelGeometry.platform[player.current_platform.index];
    if (player.current_platform.type === 2)
        var plat = game.levelGeometry.platformD[player.current_platform.index];
    if (player.current_platform.type === 3)
        var plat = game.levelGeometry.platformM[player.current_platform.index];

    if (player.x > plat.x+plat.width || player.x < plat.x) {
        player.grounded = false;
        player.current_platform.type = 0;
        player.current_platform.index = 0;
    }
}


function checkLanding() {
    if (player.y > game.floor - (player.height/2)) {
        player.dy = 0;
        player.y = game.floor - (player.height/2);
        player.grounded = true;
        player.airjump = player.airjump_max;
        player.current_platform.type = 0;
        player.current_platform.index = 0;
    }
    if (player.y > game.killfloor) {
        game.lose = true;
        game.losecounter = 100;
        let backvector = [game.cameraorigin.x - game.camera.x,// - game.playerspawn.x,
                          game.cameraorigin.y - game.camera.y];// - game.playerspawn.y];
        //let backdist = Math.sqrt(backvector[0]**2 + backvector[1]**2);
        game.losevect[0] = backvector[0] / game.losecounter;
        game.losevect[1] = backvector[1] / game.losecounter;

        player.x = game.playerspawn.x;
        player.y = game.playerspawn.y;
        player.dx = 0;
        player.dy = 0;
        player.xcceleration = 0;
        player.airjump = player.airjump_max;
    }
}


function movePlayer() {

    if (!player.grounded) {
        
        // Jump
        if (player.dy < 0 && inputs.jump) {
            player.dy += 0.15;// Jump higher when holding "jump" key
        }
        else {
            if (player.dy > 0 && player.horz_mult === 0)
                player.dy += 0.05;// Slide slowly down a wall
            else
                player.dy += 0.2;
        }

        // Horizontal control in mid-air
        //if (player.dx_physics < 0) {
        //    if (player.dx)
        //}

        checkLanding();
        checkLandingPlatform();
        checkLandingDiagonal();
        checkLandingMoving();
        checkCeiling();
    }
    else {
        if (player.current_platform.type > 0)
            checkFalling();
        if (player.current_platform.type === 2) {
            let angle = game.levelGeometry.platformD[player.current_platform.index].angle;
            player.dy = -1 * Math.sin(angle) * player.dx;
        }
        if (player.current_platform.type === 3) {
            let plat = game.levelGeometry.platformM[player.current_platform.index];
            if (plat.direction === 0)
                player.y = plat.y - (player.height/2);
            player.dx_platform = plat.travelvect[0] * plat.speed * plat.direction;
            player.dy = plat.travelvect[1] * plat.speed * plat.direction;
        }
        else
            player.dx_platform = 0;

        if (Math.abs(player.dx_physics) < 0.01)
            player.dx_physics = 0;
        else
            player.dx_physics *= 0.7;
    }

    checkWalls();
    
    player.x_prev = player.x;
    player.y_prev = player.y;

    if (Math.abs(player.dx) < player.dx_max)
        player.dx += player.xcceleration;
    if (Math.abs(player.dx) < 0.001)
        player.dx = 0;

    player.y += player.dy/* + player.dy_physics*/;
    player.x += (player.dx + player.dx_physics + player.dx_platform) * player.horz_mult;

}




    
onmousedown = (e) => {
    let destination = {x: e.offsetX + game.camera.x,
                       y: e.offsetY + game.camera.y};
    let rocketvect = [destination.x - player.x, destination.y - player.y];
    let rocketvectlength = Math.sqrt(rocketvect[0]**2 + rocketvect[1]**2);
    let rocketnorm = [rocketvect[0]/rocketvectlength,
                      rocketvect[1]/rocketvectlength];
    let spawnpos = {x: player.x + (rocketnorm[0] * 5),
                    y: player.y + (rocketnorm[1] * 5)};
    let spawnangle = Math.atan(rocketnorm[1] / rocketnorm[0]);
    if (player.x > destination.x)
        spawnangle += Math.PI;
    
    let rockettoadd = new Rocket(spawnpos.x, spawnpos.y, spawnangle, 4);
    
    game.rocketList.push(rockettoadd);

    console.log(game.rocketList[game.rocketList.length-1].killpos);
}
var inputs = {
    left: false,
    right: false,
    jump: false,
}
onkeydown = (e) => {
    if (e.code === "ArrowRight")
        inputs.right = true;
    if (e.code === "KeyD")
        inputs.right = true;
    if (e.code === "ArrowLeft")
        inputs.left = true;
    if (e.code === "KeyA")
        inputs.left = true;
    if (e.code === "ArrowUp")
        inputs.jump = true;
    if (e.code === "KeyW")
        inputs.jump = true;
    if (e.code === "KeyF") {
        console.log(player);
    }
    if (e.code === "KeyG") {
        console.log(game);
    }
}
onkeyup = (e) => {
    if (e.code === "ArrowRight")
        inputs.right = false;
    if (e.code === "KeyD")
        inputs.right = false;
    if (e.code === "ArrowLeft")
        inputs.left = false;
    if (e.code === "KeyA")
        inputs.left = false;
    if (e.code === "ArrowUp")
        inputs.jump = false;
    if (e.code === "KeyW")
        inputs.jump = false;
}
function handleInputs() {

    // Left-Right Movement
    let LR = 0;
    if (inputs.left)
        LR--;
    if (inputs.right)
        LR++;
    /*if (inputs.left) {
        if (inputs.right) {
            player.xcceleration = 0;
            if (player.dx > 0)
                player.dx *= 0.85;
            if (player.dx < 0)
                player.dx *= 0.85;
        }
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
    }*/
    player.xcceleration = 0.1 * LR;
    if (LR === 0)
        player.dx *= 0.85;
    
    // Jump
    if (inputs.jump && player.airjump > 0 && player.jump_release) {
        player.dy = -1 * player.jump;
        player.airjump--;
        player.grounded = false;
        player.jump_release = false;
        if (player.current_platform.type === 3) {
            let plat = game.levelGeometry.platformM[player.current_platform.index];
            player.dy += plat.travelvect[1] * plat.speed * plat.direction;
        }
    }
    if (!inputs.jump)
        player.jump_release = true;
}






function drawPlayer(draw2d) {
    //const canvas = document.getElementById("canvas");
    //if (canvas.getContext) {
    //    var draw2d = canvas.getContext("2d");
        
        draw2d.fillRect(player.x-(player.width/2), player.y-(player.height/2), player.width,player.height);
        
    //}
}
