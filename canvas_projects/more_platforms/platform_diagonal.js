class PlatformDiagonal {
    
    //              /
    //             / 
    //            /  
    //           /   
    //          /    
    //         /     
    // (x,y)__/)-angle
    //        |-----|
    //         width
    constructor(x,y, width, angle) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.angle = angle;
        this.length = this.width / Math.cos(this.angle);
    }
}

function checkLandingDiagonal() {
    for (let i = 0; i < game.levelGeometry.platformD.length; i++) {
        let plat = game.levelGeometry.platformD[i];
        if (player.x-(player.width/2) < plat.x+plat.width &&
            player.x+(player.width/2) > plat.x) {

                /*let angle = plat.angle;
                if (angle > 0)
                    angle = Math.PI - angle;
                //console.log("player.y:"+player.y+", platform y:"+(plat.y+Math.cos(angle)*(player.x-plat.x)));*/
                
            if (player.dy >= 0 &&
                player.y+(player.height/2) >= plat.y - (Math.tan(plat.angle) * (player.x-plat.x)) &&
                player.y_prev+(player.height/2) < plat.y - (Math.tan(plat.angle) * (player.x_prev-plat.x))
                ) {
                    //console.log("landed on diagonal platform with angle "+plat.angle+"->"+Math.cos(plat.angle));

                player.dy = 0;
                player.y = plat.y - (player.height/2) - (Math.tan(plat.angle) * (player.x-plat.x));
                player.grounded = true;
                player.airjump = player.airjump_max;
                player.current_platform.type = 2;
                player.current_platform.index = i;
                player.horz_mult = Math.cos(plat.angle);
            }

        }

    }
}

function drawPlatformsDiagonal(draw2d) {

    //const canvas = document.getElementById("canvas");
    //var draw2d = canvas.getContext("2d");

    draw2d.beginPath();
    for (let i = 0; i < game.levelGeometry.platformD.length; i++) {
        let plat = game.levelGeometry.platformD[i];
        draw2d.moveTo(plat.x, plat.y);
        draw2d.lineTo(plat.x + plat.width,
                      plat.y - (plat.length*Math.sin(plat.angle)));
    }
    draw2d.stroke();
}

//var platformDList = [];
