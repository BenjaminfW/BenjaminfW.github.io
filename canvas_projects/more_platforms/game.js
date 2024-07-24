var frame = 0;

var game = {
    W: 0,
    H: 0,

    level: 0,
    levelTransition: true,

    levelGeometry: {
        platform: [],
        platformD: [],
        platformM: [],
        wall: [],
        ceiling: [],
    },
    /*platformList: [],
    platformDList: [],
    platformMList: [],
    wallList: [],
    ceilingList: [],*/
    interactList: [],
    rocketList: [],
    explosionList: [],

    camera: {x: 0, y: 0},
    movecamera: [0,0],

    floor: 500,

    killfloor: 600,
    cameraorigin: {x: 0, y: 0},
    playerspawn: {x: 0, y: 0},
    lose: false,
    losecounter: 0,
    losevect: [0,0]
}

function startGame() {
    game.W = document.getElementById("canvas").width;
    game.H = document.getElementById("canvas").height;

    game.level = 0;

    startLevel(true);
}

//const W = document.getElementById("canvas").clientWidth;
//const H = document.getElementById("canvas").clientHeight;
//console.log("W:"+W+", H:"+H);

//var current_level = 0;

//var drawWindowPosition = [0,0];



function drawGround(draw2d) {

    //const canvas = document.getElementById("canvas");
    //var draw2d = canvas.getContext("2d");
    
    draw2d.beginPath();
    draw2d.moveTo(0,game.floor);
    draw2d.lineTo(800,game.floor);
    draw2d.stroke();
}

function drawBackground(draw2d) {
    //const canvas = document.getElementById("canvas");
    //var draw2d = canvas.getContext("2d");
    
    draw2d.clearRect(game.camera.x,game.camera.y, game.W,game.H);
}


function draw() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        if (game.losecounter > 0) {
            game.movecamera[0] = game.losevect[0];
            game.movecamera[1] = game.losevect[1];
            //game.camera.x += game.losevect[0];
            //game.camera.y += game.losevect[1];
            game.losecounter -= 1;
            //console.log(game.losecounter);
        }
        else {
            game.movecamera[0] = 0;
            game.movecamera[1] = 0;
            game.lose = false;
        }
        game.camera.x += game.movecamera[0];
        game.camera.y += game.movecamera[1];
        


        if (player.x > 200) {
            if (player.x < game.camera.x + (canvas.width*0.25)) // use game.W?
                game.camera.x = player.x - (canvas.width*0.25);
        }
        if (player.x > game.camera.x + (canvas.width*0.75))
            game.camera.x = player.x - (canvas.width*0.75);
        if (player.y > game.camera.y + (canvas.height*0.75))
            game.camera.y = player.y - (canvas.height*0.75);
        if (player.y < game.camera.y + (canvas.height*0.25))
            game.camera.y = player.y - (canvas.height*0.25);



        ctx.save();
        ctx.translate(-1*game.camera.x,-1*game.camera.y);

        drawBackground(ctx);
        drawGround(ctx);
        drawPlatforms(ctx);
        drawWalls(ctx);
        drawPlatformsDiagonal(ctx);
        drawPlatformsMoving(ctx);
        drawCeiling(ctx);
        drawInteractables(ctx);
        drawRockets(ctx);
        ctx.beginPath();
        for (let i = 0; i < game.explosionList.length; i++) {
            ctx.moveTo(game.explosionList[i].x,game.explosionList[i].y);
            ctx.arc(game.explosionList[i].x,game.explosionList[i].y, 20, 0,2*Math.PI, true)
        }
        ctx.stroke();
        
        drawPlayer(ctx);
        
        ctx.restore();
    }
}



function detectLevelEnd() {
    if (game.interactList[0].activated && !game.interactList[0].activated_prev) {
        game.level++;
        if (game.level < levels.length) {
            game.levelTransition = true;
            startLevel(false);
        }
        else
            document.getElementById("alert").innerText = "win";
    }
}













/*function loseAnimation() {
    if (game.losecounter < 100) {
        const canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");

            ctx.save();
            ctx.translate();

            drawBackground(ctx);
            drawGround(ctx);
            drawPlatforms(ctx);
            drawWalls(ctx);
            drawPlatformsDiagonal(ctx);
            drawPlatformsMoving(ctx);

            ctx.restore();
        }


        window.requestAnimationFrame(loseAnimation);
    }
    else {
        //player.x = levels[game.current_level].starting_point[0];
        //player.y = levels[game.current_level].starting_point[1];
        //game.camera = [0,0];
        //startLevel();
        loop();
    }
}*/




function startLevel(gamestart) {
    /*while (game.platformList.length > 0)
        game.platformList.pop();
    while (game.platformDList.length > 0)
        game.platformDList.pop();
    while (game.platformMList.length > 0)
        game.platformMList.pop();
    while (game.wallList.length > 0)
        game.wallList.pop();
    while (game.ceilingList.length > 0)
        game.ceilingList.pop();*/
    /*game.platformList = [];
    game.platformDList = [];
    game.platformMList = [];
    game.wallList = [];
    game.ceilingList = [];
    game.rocketList = [];
    console.log(game);*/
    // Be sure to thank your local garbage collector


    var level = levels[game.level];
    
    player.x = level.starting_point[0];
    player.y = level.starting_point[1];
    game.playerspawn.x = level.starting_point[0];
    game.playerspawn.y = level.starting_point[1];
    //player.dy = 0;
    player.current_platform.type = 0;
    player.current_platform.index = 0;

    let newlevel = {
        platform: [],
        platformD: [],
        platformM: [],
        wall: [],
        ceiling: [],

    };
    
    for (let i = 0; i < level.platforms.length; i++) {
        let levelplat = level.platforms[i];
        let platform = new Platform(levelplat[0],levelplat[1],levelplat[2]);
        newlevel.platform.push(platform);
    }
    for (let i = 0; i < level.Dplatforms.length; i++) {
        let levelplat = level.Dplatforms[i];
        let platform = new PlatformDiagonal(levelplat[0],levelplat[1],levelplat[2],levelplat[3]);
        newlevel.platformD.push(platform);
    }
    for (let i = 0; i < level.Mplatforms.length; i++) {
        let levelplat = level.Mplatforms[i];
        let platform = new PlatformMoving(levelplat[0],levelplat[1],
                                          levelplat[2],levelplat[3],
                                          levelplat[4],levelplat[5]);
        newlevel.platformM.push(platform);
    }
    for (let i = 0; i < level.walls.length; i++) {
        let levelwall = level.walls[i];
        let wall = new Wall(levelwall[0],levelwall[1],levelwall[2]);
        newlevel.wall.push(wall);
    }
    for (let i = 0; i < level.ceilings.length; i++) {
        let levelceil = level.ceilings[i];
        let ceiling = new Ceiling(levelceil[0],levelceil[1],levelceil[2]);
        newlevel.ceiling.push(ceiling);
    }

    game.levelGeometry = newlevel;

    game.floor = level.floor;
    game.killfloor = level.kill_floor;

    if (level.starting_point[0] < game.W * 0.25)
        game.camera.x = 0;
    else
        game.camera.x = level.starting_point[0] + (game.W/2);
    game.camera.y = level.starting_point[1] - (game.H/2);
    game.cameraorigin.x = game.camera.x;
    game.cameraorigin.y = game.camera.y;

    let newend = new Interactable(level.end_point[0],level.end_point[1], 10,10);
    game.interactList[0] = newend;

    console.log(game);

    
    //if (gamestart) {
    //    game.levelTransition = false;
    //    loop();
    //}
    if (game.levelTransition) {
        game.levelTransition = false;
        loop();
    }
    
}


function loop() {

    handleInputs();
    if (!game.lose)
        movePlayer();
    movePlatforms();
    detectInteractables();
    detectLevelEnd();
    moveRocket();

    draw();

    frame++;
    if (frame % 100 === 0)
        console.log(game.levelTransition);
    

    if (!game.levelTransition)
        window.requestAnimationFrame(loop);

}
