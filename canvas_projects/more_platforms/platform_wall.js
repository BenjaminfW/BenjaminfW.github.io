class Wall {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;
    }
}

function checkWalls() {
    for (let i = 0; i < game.levelGeometry.wall.length; i++) {
        let wall = game.levelGeometry.wall[i];
        if (player.y-(player.height/2) < wall.y+wall.height &&
            player.y+(player.height/2) > wall.y) {
            
                //console.log("inside wall zone");
            
            
            if (player.dx > 0 && (player.x >= wall.x && player.x_prev < wall.x)) {
                //console.log("wall hit");
                player.x = wall.x-(player.width/2);
                player.horz_mult = 0;
                player.airjump = player.airjump_max;
                player.jump_release = false;
            }
            if (player.dx < 0 && (player.x <= wall.x && player.x_prev > wall.x)) {
                //console.log("wall hit");
                player.x = wall.x+(player.width/2);
                player.horz_mult = 0;
                player.airjump = player.airjump_max;
                player.jump_release = false;
            }

            if ((player.dx > 0 && player.x > wall.x) || (player.dx < 0 && player.x < wall.x))
                player.horz_mult = 1;

        }
        else
            player.horz_mult = 1;
    }
}

function drawWalls(draw2d) {

    //const canvas = document.getElementById("canvas");
    //var draw2d = canvas.getContext("2d");

    draw2d.beginPath();
    for (let i = 0; i < game.levelGeometry.wall.length; i++) {
        let wall = game.levelGeometry.wall[i];
        
        draw2d.moveTo(wall.x, wall.y);
        draw2d.lineTo(wall.x, wall.y+wall.height);
    }
    draw2d.stroke();
}

//var wallList = [];
