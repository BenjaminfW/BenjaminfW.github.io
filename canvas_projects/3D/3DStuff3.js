var game = {
    running: false,
    
};

var player = {
    x: 0,
    y: 0,
    angle: 0,

    turnspeed: 0.015
};

var room = [
    {x: 10, y: 10},
    {x: 20, y: 10},
    {x: 20, y: 20},
    {x: 10, y: 20}
];

function getDistTo(obj) { return Math.sqrt((obj.x-player.x)**2 + (obj.y-player.y)**2); }

function getAngleTo(obj) { return Math.atan((player.y-obj.y) / (player.x-obj.x)); }


function render() {
    var canvas = document.getElementById("main");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        draw2d.clearRect(0,0, 800,500);

        //let vertices2draw = [];

        let playerfacing = [Math.cos(player.angle), Math.sin(player.angle)];

        for (let i = 0; i < room.length; i++) {
            let vect2vert1 = [room[i].x - player.x, room[i].y - player.y];
            let vect2vert2 = [room[(i+1)%room.length].x - player.x, room[(i+1)%room.length].y - player.y];

            let height1 = 500 / getDistTo(room[i]);
            let apparentpos1 = 400 + Math.tan(player.angle - getAngleTo(room[i])) * 800;
            let height2 = 500 / getDistTo(room[(i+1)%room.length]);
            let apparentpos2 = 400 + Math.tan(player.angle - getAngleTo(room[(i+1)%room.length])) * 800;

            if (vect2vert1[0] * playerfacing[0] + vect2vert1[1] * playerfacing[1] > 0 &&
                vect2vert2[0] * playerfacing[0] + vect2vert2[1] * playerfacing[1] > 0
            ) {
                draw2d.beginPath();

                draw2d.moveTo(apparentpos1, 250 - height1);
                draw2d.lineTo(apparentpos2, 250 - height2);
                draw2d.lineTo(apparentpos2, 250 + height2);
                draw2d.lineTo(apparentpos1, 250 + height1);

                draw2d.fill();
            }
            else {

                if (apparentpos1 > 800) {
                    apparentpos1 = 800;
                    height1 *= (apparentpos1 - 800) / (apparentpos1 - apparentpos2);
                }
                if (apparentpos1 < 0) {
                    apparentpos1 = 0;
                    height1 *= (0 - apparentpos1) / (apparentpos2 - apparentpos1);
                }
                if (apparentpos2 > 800) {
                    apparentpos2 = 800;
                    height2 *= (apparentpos2 - 800) / (apparentpos2 - apparentpos1);
                }
                if (apparentpos2 < 0) {
                    apparentpos2 = 0;
                    height2 *= (0 - apparentpos2) / (apparentpos1 - apparentpos2);
                }

                draw2d.beginPath();
                draw2d.moveTo(apparentpos1, 250 - height1);
                draw2d.lineTo(apparentpos2, 250 - height2);
                draw2d.lineTo(apparentpos2, 250 + height2);
                draw2d.lineTo(apparentpos1, 250 + height1);
                draw2d.fill();
            }
        }

        /*draw2d.beginPath();

        // Draw Top
        draw2d.moveTo(400 + Math.tan(player.angle - getAngleTo(room[0])) * 800, 500 / getDistTo(room[0]));
        for (let i = 0; i < room.length; i++) {
            let vect2vert = [room[i].x - player.x, room[i].y - player.y];

            if (vect2vert[0] * playerfacing[0] + vect2vert[1] * playerfacing[1] > 0) {
                let height = 500 / getDistTo(room[i]);
                let apparentpos = 400 + Math.tan(player.angle - getAngleTo(room[i])) * 800;

                draw2d.lineTo(apparentpos, 250 - height);
            }
        }

        // Draw Bottom
        for (let i = room.length-1; i >= 0; i--) {
            let vect2vert = [room[i].x - player.x, room[i].y - player.y];

            if (vect2vert[0] * playerfacing[0] + vect2vert[1] * playerfacing[1] > 0) {
                let height = 500 / getDistTo(room[i]);
                let apparentpos = 400 + Math.tan(player.angle - getAngleTo(room[i])) * 800;

                draw2d.lineTo(apparentpos, 250 + height);
            }
        }

        draw2d.fill();*/
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
    forward: false,
    backward: false,
    left: false,
    right: false,
    lookleft: false,
    lookright: false
};
onkeydown = (e) => {
    switch (e.code) {
        case "KeyW":
            input.forward = true; break;
        case "KeyS":
            input.backward = true; break;
        case "KeyA":
            input.left = true; break;
        case "KeyD":
            input.right = true; break;
        case "ArrowLeft":
            input.lookleft = true; break;
        case "ArrowRight":
            input.lookright = true; break;
        case "KeyH":
            console.log(player);
            break;
    }
}
onkeyup = (e) => {
    switch (e.code) {
        case "KeyW":
            input.forward = false; break;
        case "KeyS":
            input.backward = false; break;
        case "KeyA":
            input.left = false; break;
        case "KeyD":
            input.right = false; break;
        case "ArrowLeft":
            input.lookleft = false; break;
        case "ArrowRight":
            input.lookright = false; break;
    }
}
function handleInput() {
    if (input.forward) {
        player.x += Math.cos(player.angle) / 3;
        player.y += Math.sin(player.angle) / 3;
    }
    if (input.backward) {
        player.x -= Math.cos(player.angle) / 3;
        player.y -= Math.sin(player.angle) / 3;
    }
    if (input.left) {
        player.x += Math.cos(player.angle + Math.PI/2) / 3;
        player.y += Math.sin(player.angle + Math.PI/2) / 3;
    }
    if (input.right) {
        player.x += Math.cos(player.angle - Math.PI/2) / 3;
        player.y += Math.sin(player.angle - Math.PI/2) / 3;
    }
    if (input.lookleft) {
        player.angle += player.turnspeed;
    }
    if (input.lookright) {
        player.angle -= player.turnspeed;
    }

}







function start() {
    
    drawBackground();
    if (!game.running)
        loop();
    game.running = true;
}

function loop() {
    handleInput();

    render();

    window.requestAnimationFrame(loop);
}
