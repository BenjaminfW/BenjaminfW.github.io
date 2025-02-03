var game = {
    running: false,
    turnspeed: 0.01
};

var wall = {
    x: 10,
    y: 10,

    vp: 0
};

var post = {
    x: -10,
    y: -10
};

var player = {
    x: 0,
    y: 0,

    angle: 0
};

function getDist(obj) { return Math.sqrt((obj.x-player.x)**2 + (obj.y-player.y)**2); }

function getAngleTo(obj) { return Math.atan((player.y-obj.y) / (player.x-obj.x)); }

function drawWall() {
    var canvas = document.getElementById("main");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        //draw2d.clearRect(0,0, 800,500);

        let height = 500 / getDist(wall);

        draw2d.beginPath();
        draw2d.moveTo(0, 250 - height);
        draw2d.lineTo(wall.vp, 250);
        draw2d.lineTo(0, 250 + height);
        draw2d.fill();
    }
}

function drawPost() {
    var canvas = document.getElementById("main");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        let height = 500 / getDist(post);
        let apparentpos = 400 + Math.tan(player.angle - getAngleTo(post)) * 800;

        draw2d.beginPath();
        draw2d.moveTo(apparentpos, 250 - height);
        draw2d.lineTo(apparentpos, 250 + height);
        draw2d.stroke();
    }
}

function drawBackground() {
    //console.log("drawing background");
    var canvas = document.getElementById("background");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");        

        var bgGradient1 = draw2d.createLinearGradient(0,0, 0,250);
        bgGradient1.addColorStop(0, "white");
        bgGradient1.addColorStop(0.6, "gray");
        bgGradient1.addColorStop(1, "black");

        var bgGradient2 = draw2d.createLinearGradient(0,250, 0,500);
        bgGradient2.addColorStop(0, "black");
        bgGradient2.addColorStop(0.4, "gray");
        bgGradient2.addColorStop(1, "white");

        draw2d.fillStyle = bgGradient1;
        draw2d.fillRect(0,0, 800,250);
        draw2d.fillStyle = bgGradient2;
        draw2d.fillRect(0,250, 800,250);
    }
}

var input = {
    left: false,
    right: false,
    up: false,
    down: false
};
onkeydown = (e) => {
    if (e.code === "KeyD")
        console.log(Math.tan(player.angle - getAngleTo(post)));
    if (e.code === "ArrowLeft")
        input.right = true;
    if (e.code === "ArrowRight")
        input.left = true;
    if (e.code === "ArrowUp")
        input.up = true;
    if (e.code === "ArrowDown")
        input.down = true;
}
onkeyup = (e) => {
    if (e.code === "ArrowLeft")
        input.right = false;
    if (e.code === "ArrowRight")
        input.left = false;
    if (e.code === "ArrowUp")
        input.up = false;
    if (e.code === "ArrowDown")
        input.down = false;
}

function handleInput() {
    if (input.left)
        player.angle -= game.turnspeed;
    if (input.right)
        player.angle += game.turnspeed;

    if (input.up) {
        player.x += Math.cos(player.angle) / 3;
        player.y += Math.sin(player.angle) / 3;
    }
    if (input.down) {
        player.x -= Math.cos(player.angle) / 3;
        player.y -= Math.sin(player.angle) / 3;
    }

    wall.vp = Math.tan(player.angle) * 800;
}

function start() {
    
    drawBackground();
    if (!game.running)
        loop();
    game.running = true;
}

function loop() {
    handleInput();

    document.getElementById("main").getContext("2d").clearRect(0,0, 800,500);
    let playerfacing = [Math.cos(player.angle), Math.sin(player.angle)];
    let vect2wall = [wall.x - player.x, wall.y - player.y];
    if (vect2wall[0] * playerfacing[0] + vect2wall[1] * playerfacing[1] > 0)
        drawWall();
    let vect2post = [post.x - player.x, post.y - player.y];
    if (vect2post[0] * playerfacing[0] + vect2post[1] * playerfacing[1] > 0)
        drawPost();

    window.requestAnimationFrame(loop);
}
