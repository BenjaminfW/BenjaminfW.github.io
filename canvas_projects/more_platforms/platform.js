class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        
        this.coyotetime = 5;
    }
}

function checkLandingPlatform() {
    for (let i = 0; i < game.levelGeometry.platform.length; i++) {
        var plat = game.levelGeometry.platform[i];
        if (player.x-(player.width/2) > plat.x-plat.coyotetime &&
            player.x+(player.width/2) < plat.x+plat.width+plat.coyotetime &&
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



function drawPlatforms(draw2d) {

    //const canvas = document.getElementById("canvas");
    //var draw2d = canvas.getContext("2d");

    draw2d.beginPath();
    for (let i = 0; i < game.levelGeometry.platform.length; i++) {
        let plat = game.levelGeometry.platform[i];

        //if (plat.x is in view && plat.y is in view)
        draw2d.moveTo(plat.x, plat.y);
        draw2d.lineTo(plat.x+plat.width, plat.y);
    }
    draw2d.stroke();
}




//var platformList = [];


