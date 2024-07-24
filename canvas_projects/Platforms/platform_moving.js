class PlatformMoving {
    constructor(x1,y1, x2,y2, width, speed) {
        this.x = x1;
        this.y = y1;

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
        this.coyotetime = 5;

        this.speed = speed;
        let traveldist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        this.travelvect = [(x2-x1)/traveldist, (y2-y1)/traveldist];
        this.direction = 0;
        this.timer = 100;

        //console.log(this.travelvect);
    }
}

function movePlatforms() {
    for (let i = 0; i < platformMList.length; i++) {
        let plat = platformMList[i];

        if (plat.direction === 0) {
            
            if (plat.timer <= 0) {
                if (plat.x === plat.x1 && plat.y === plat.y1)
                    platformMList[i].direction = 1;
                if (plat.x === plat.x2 && plat.y === plat.y2)
                    platformMList[i].direction = -1;
            }
            
            platformMList[i].timer -= 1;
        }
        else {
            // Check whether the vector to the next endpoint is facing
            // the same way as the direction vector
            //    *<----o----------------------*  direction: <--
            // o->*----------------------------*  direction: <--
            //    o----------------------------*  direction: 0 (wait)
            let endpoint = [];
            if (plat.direction === 1)
                endpoint = [plat.x2,plat.y2];
            else if (plat.direction === -1)
                endpoint = [plat.x1,plat.y1];
            let endpointdist = Math.sqrt((plat.x-endpoint[0])**2 + (plat.y-endpoint[1])**2);
            let endpointvect = [(plat.x-endpoint[0])/endpointdist, (plat.y-endpoint[1])/endpointdist];
            //console.log(endpointvect);
            if ((endpointvect[0] * plat.travelvect[0]) + (endpointvect[1] * plat.travelvect[1]) === plat.direction) {
                platformMList[i].direction = 0;
                platformMList[i].timer = 100;
                platformMList[i].x = endpoint[0];
                platformMList[i].y = endpoint[1];
            }
        }

        //console.log("x:"+plat.x+", y:"+plat.y+", travelvect:["+plat.travelvect+"], direction:"+plat.direction);


        platformMList[i].x += plat.travelvect[0] * plat.direction * plat.speed;
        platformMList[i].y += plat.travelvect[1] * plat.direction * plat.speed;
    }
}



function checkLandingMoving() {
    for (let i = 0; i < platformMList.length; i++) {
        var plat = platformMList[i];
        if (player.x+(player.width/2) > plat.x-(plat.width/2)-plat.coyotetime &&
            player.x-(player.width/2) < plat.x+(plat.width/2)+plat.coyotetime &&
            player.dy >= 0 &&
            (player.y_prev+(player.height/2) < plat.y && player.y+(player.height/2) >= plat.y)) {

            //player.dx = plat.travelvect[0] * plat.speed;
            player.dy = plat.travelvect[1] * plat.speed;
            player.y = plat.y - (player.height/2);
            player.grounded = true;
            player.airjump = player.airjump_max;
            player.current_platform.type = 3;
            player.current_platform.index = i;
        }
    }
}


function drawPlatformsMoving() {

    const canvas = document.getElementById("canvas");
    var draw2d = canvas.getContext("2d");
    
    draw2d.beginPath();
    for (let i = 0; i < platformMList.length; i++) {
        let plat = platformMList[i];

        draw2d.moveTo(plat.x-(plat.width/2), plat.y);
        draw2d.lineTo(plat.x+(plat.width/2), plat.y);
    }
    draw2d.stroke();
}

var platformMList = [];