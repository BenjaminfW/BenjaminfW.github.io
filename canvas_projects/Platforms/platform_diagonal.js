class PlatformDiagonal {
    
    //              /
    //             / 
    //            /  
    //           /--(x,y)
    //          /    
    //         /     
    //        /)-angle
    //       |-------|
    //         width
    constructor(x,y, width, angle) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.angle = angle;
    }
}

function checkLandingDiagonal() {
    for (let i = 0; i < platformDList.length; i++) {
        let plat = platformDList[i];
        if (player.x-(player.width/2) < plat.x+(plat.width/2) &&
            player.x+(player.width/2) > plat.x-(plat.width/2)) {

                /*let normalangle = plat.angle + (Math.PI);
                let normalvect = [Math.cos(normalangle),Math.sin(normalangle)];
                let playervect = [player.x-player.x_prev, player.y-player.y_prev];
                let playervectLength = Math.sqrt((playervect[0]**2) + (playervect[1]**2));
                let playervectNorm = [playervect[0]/playervectLength, playervect[1]/playervectLength];
                let dot = (playervectNorm[0] * normalvect[0]) + (playervectNorm[1] * normalvect[1]);*/
                
            if (player.dy >= 0 &&
                player.y+(player.height/2) >= plat.y + (Math.cos(plat.angle) * (player.x-plat.x)) &&
                player.y_prev+(player.height/2) < plat.y + (Math.cos(plat.angle) * (player.x_prev-plat.x))// &&
                /*dot >= 0*/
                ) {
                    //console.log("landed on diagonal platform");
                    //console.log(dot);

                player.dy = 0;
                player.y = plat.y - (player.height/2) + (Math.cos(plat.angle) * (player.x-plat.x));
                player.grounded = true;
                player.airjump = player.airjump_max;
                player.current_platform.type = 2;
                player.current_platform.index = i;
                player.horz_mult = Math.cos(plat.angle);
            }

        }

    }
}

function drawPlatformsDiagonal() {

    const canvas = document.getElementById("canvas");
    var draw2d = canvas.getContext("2d");

    draw2d.beginPath();
    for (let i = 0; i < platformDList.length; i++) {
        let plat = platformDList[i];
        draw2d.moveTo(plat.x - (plat.width/2),
                      plat.y + ((plat.width/2)*Math.sin(plat.angle)));
        draw2d.lineTo(plat.x + (plat.width/2),
                      plat.y - ((plat.width/2)*Math.sin(plat.angle)));
    }
    draw2d.stroke();
}

var platformDList = [];