class Rocket {
    constructor(x, y, direction, speed) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        
        this.dx_norm = Math.cos(direction);
        this.dy_norm = Math.sin(direction);
        this.dx = this.dx_norm * speed + (player.dx * 0.0);
        this.dy = this.dy_norm * speed + (player.dy * 0.0);
        

        this.origin = {x: player.x, y: player.y};
        //this.life = 1000;
        this.killpos = {x: this.dx_norm*2000, y: this.dy_norm*2000, type: "default"};
        this.killposList = [this.killpos];

        // Rather than calculate intersections every single frame, it's better to find where the rocket will
        // collide on creation, since this is entirely deterministic

        for (let i = 0; i < game.levelGeometry.platform.length; i++) {
            let plat = game.levelGeometry.platform[i];
            let rocketx_atplat = this.origin.x + ((plat.y - this.origin.y) * (this.dx_norm/this.dy_norm));
            //console.log("rocketX: "+rocketx_atplat+", platform: "+plat.x+"+"+plat.width+","+plat.y);
            if (rocketx_atplat > plat.x && rocketx_atplat < plat.x + plat.width) {
                //console.log("platform intersection found");
                let killposcandidate = {
                    x: rocketx_atplat,
                    y: plat.y,
                    type: "platform"
                };
                //this.killpos.x = rocketx_atplat;
                //this.killpos.y = plat.y;
                //this.killpos.type = "platform";
                this.killposList.push(killposcandidate);
            }
        }

        for (let i = 0; i < game.levelGeometry.wall.length; i++) {
            let wall = game.levelGeometry.wall[i];
            let rockety_atwall = this.origin.y + ((wall.x - this.origin.x) * (this.dy_norm/this.dx_norm));
            //console.log("rocketY: "+rockety_atwall+", wall: "+wall.x+","+wall.y+"+"+wall.height);
            if (rockety_atwall > wall.y && rockety_atwall < wall.y + wall.height) {

                let killposcandidate = {
                    x: wall.x,
                    y: rockety_atwall,
                    type: "wall"
                };
                //this.killpos.x = wall.x;
                //this.killpos.y = rockety_atwall;
                //this.killpos.type = "wall";
                this.killposList.push(killposcandidate);
            }
        }
        //console.log(this.killposList);

        for (let i = 0; i < game.levelGeometry.ceiling.length; i++) {
            let ceil = game.levelGeometry.ceiling[i];
            let rocketx_atceil = this.origin.x + ((ceil.y - this.origin.y) * (this.dx_norm/this.dy_norm));
            
            if (rocketx_atceil > ceil.x && rocketx_atceil < ceil.x + ceil.width) {
                
                let killposcandidate = {
                    x: rocketx_atceil,
                    y: ceil.y,
                    type: "ceiling"
                };
                
                this.killposList.push(killposcandidate);
            }
        }

        for (let i = 0; i < game.levelGeometry.platformD.length; i++) {
            let plat = game.levelGeometry.platformD[i];

            //   _______
            //   \    |_|/
            //    \     |
            //     \   /|
            //      \ / |
            //       \  |
            //      / \ |
            //     /   \|
            //    /
            //
            // There's some theorem that states that any line intersecting a triangle must intersect two
            // sides (unless it is the side). We can use this to deduce that if the rocket's path passes
            // through either of the cartesian components of the diagonal platform, it must be intersecting
            // the platform. However, if the path intersects both of them, it does not intersect the
            // platform.
            let rocketx_athorz = this.origin.x + ((plat.y - this.origin.y) * (this.dx_norm/this.dy_norm));
            let rockety_atvert = this.origin.y + (((plat.x+plat.width) - this.origin.x) * (this.dy_norm/this.dx_norm));

            let platheight = plat.length * Math.sin(plat.angle);
            let horz_collide = (rocketx_athorz > plat.x && rocketx_athorz < plat.x + plat.width);
            let vert_collide = (rockety_atvert > plat.y - platheight && rockety_atvert < plat.y);

            // If a cartesian collision is detected, it forms another triangle within the larger one with
            // one known side length, one known angle, and one angle that can be computed. We must then
            // compute the one remaining angle and use it with the Law of Sines to find the length of the
            // side connecting the origin and the point at which the rocket intersects the platform.
            /*if (horz_collide && !vert_collide) {
                let angleA = plat.angle;
                let angleB = Math.atan(this.dy_norm / this.dx_norm);
                //if (angleB > Math.PI)
                //    angleB = 2*Math.PI - angleB;
                //if (angleA < 0)
                //    angleA = Math.PI - angleA;
                //if (angleB < 0)
                //    angleB = Math.PI - angleB;
                let angleC = Math.PI - angleA - angleB;


                let sideClength = rocketx_athorz - plat.x;

                let sideBlength = (sideClength / Math.sin(angleC)) * Math.sin(angleB);
                //console.log(sideBlength);
                //console.log("A: "+angleA+", B: "+angleB+", C: "+angleC+", Sum: "+(angleA+angleB+angleC));
                
                let killposcandidate = {
                    x: plat.x + (sideBlength * Math.cos(plat.angle)),
                    y: plat.y - (sideBlength * Math.sin(plat.angle)),
                    type: "platform - diagonal (1)"
                };

                this.killposList.push(killposcandidate);
            }*/

            // This case is solved pretty much identically, except we have to do a bit more calculation
            // to find the reference points we had previously.
            if (!horz_collide && vert_collide) {
                let angleA = (Math.PI/2) - plat.angle;
                let angleB = (Math.PI/2) - Math.atan(this.dy_norm / this.dx_norm);
                let angleC = Math.PI - angleA - angleB;

                let sideClength = platheight - (rockety_atvert - plat.y);

                let sideBlength = (sideClength / Math.sin(angleC)) * Math.sin(angleB);
                //console.log(sideBlength);
                //console.log("A: "+angleA+", B: "+angleB+", C: "+angleC+", Sum: "+(angleA+angleB+angleC));

                let killposcandidate = {
                    x: plat.x + (plat.length - sideBlength)*Math.cos(plat.angle),
                    y: plat.y - (plat.length - sideBlength)*Math.sin(plat.angle),
                    type: "platform - diagonal (2)"
                };

                this.killposList.push(killposcandidate);
            }

        }
        
        //console.log(this.killposList);
        // set killpos to the closest intersecting geometry
        for (let i = 0; i < this.killposList.length; i++) {
            var testkillpos = this.killposList[i];
            var testkillposdist = objectDistance(this.origin, this.killposList[i]);
            //console.log(testkillposdist);
            if (testkillposdist < objectDistance(this.origin, this.killpos)) {

                // It's possible that the closest intersection of geometry is opposite the direction of motion
                // so we need to see if the vector to the killpos is facing the same direction as dx and dy
                let killvect = [(testkillpos.x-this.origin.x)/testkillposdist,
                                (testkillpos.y-this.origin.y)/testkillposdist];

                if ((killvect[0]*this.dx_norm) + (killvect[1]*this.dy_norm) > 0) {
                    this.killpos.x = this.killposList[i].x;
                    this.killpos.y = this.killposList[i].y;
                    this.killpos.type = this.killposList[i].type;
                }
                /*else {
                    console.log(testkillpos);
                }*/
            }
        }

        game.explosionList.push(this.killpos);

    }
    
}

function distance(x1,y1, x2,y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}
function objectDistance(object1, object2) {
    return Math.sqrt((object1.x-object2.x)**2 + (object1.y-object2.y)**2);
}

function moveRocket() {
    for (let i = 0; i < game.rocketList.length; i++) {
        let rocket = game.rocketList[i];
        rocket.x += rocket.dx;
        rocket.y += rocket.dy;
        
        let killdist = objectDistance(rocket, rocket.killpos);
        //distance(rocket.x,rocket.y, rocket.killpos.x,rocket.killpos.y);
        // Math.sqrt((rocket.killpos.x-rocket.x)**2 + (rocket.killpos.y-rocket.y)**2);
        let killnorm = [(rocket.killpos.x-rocket.x)/killdist,
                        (rocket.killpos.y-rocket.y)/killdist];
        // NO! Not Norm!

        // Inspired by moving platforms
        // On the frame that the rocket passes its kill point,
        // delete the rocket and do explosion stuff
        if ((killnorm[0] * rocket.dx_norm) + (killnorm[1] * rocket.dy_norm) < 0) {
            game.rocketList.splice(i,1);

            let playerdist = objectDistance(rocket.killpos, player);
            //distance(rocket.killpos.x,rocket.killpos.y,player.x,player.y);
            let playervect = [(rocket.killpos.x-player.x)/playerdist,
                              (rocket.killpos.y-player.y)/playerdist];
            if (playerdist < 20) {
                //console.log(playervect[0]*(1/playerdist)+","+playervect[1]*(20/playerdist));
                player.dx -= playervect[0] * (50/playerdist);
                player.dy -= playervect[1] * (50/playerdist);
                player.grounded = false;
            }
        }
        /*if (rocket.life <= 0) {
            
        //}
        //else
        //    rocket.life--;

        //let rocketNext = {x: rocket.x+dx, y: rocket.y+dy};*/
        
    }
}

function drawRockets(draw2d) {

    draw2d.beginPath();
    for (let i = 0; i < game.rocketList.length; i++) {
        let rocket = game.rocketList[i];
        draw2d.moveTo(rocket.x,rocket.y);
        draw2d.arc(rocket.x,rocket.y, 2, 0,2*Math.PI, true);
    }
    draw2d.fill();

}
