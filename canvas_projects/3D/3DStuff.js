var game = {
    running: false,
    turnspeed: 0.01,

    angle: 0
};

var corridor = {

    vp: 0

};

function drawCorridor() {

    var canvas = document.getElementById("main");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        draw2d.clearRect(0,0, 800,500);

        //draw2d.fillStyle = "gray";

        // Left Wall

        draw2d.beginPath();
        draw2d.moveTo(0,0);
        draw2d.lineTo(corridor.vp, 250);
        draw2d.lineTo(0, 500);
        draw2d.fill();

        // Right Wall

        draw2d.beginPath();
        draw2d.moveTo(800, 0);
        draw2d.lineTo(corridor.vp, 250);
        draw2d.lineTo(800, 500);
        draw2d.fill();

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
    right: false
};
onkeydown = (e) => {
    if (e.code === "ArrowLeft")
        input.right = true;
    if (e.code === "ArrowRight")
        input.left = true;
}
onkeyup = (e) => {
    if (e.code === "ArrowLeft")
        input.right = false;
    if (e.code === "ArrowRight")
        input.left = false;
}

function handleInput() {
    if (input.left)
        game.angle -= game.turnspeed;
    if (input.right)
        game.angle += game.turnspeed;

    corridor.vp = Math.tan(game.angle) * 800;
}


function start() {
    corridor.vp = 400;
    drawBackground();
    if (!game.running)
        loop();
    game.running = true;
}

function loop() {
    handleInput();
    drawCorridor();

    window.requestAnimationFrame(loop);
}
