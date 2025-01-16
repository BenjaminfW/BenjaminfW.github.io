var Simulation = {
    planetList: [],
    planetCount: 0,
    createPlanet: false,
    protoplanet: {
        x: 0,
        y: 0,
        mass: 1
    },
    mousepos: {x: 0, y: 0},
    running: false,

    particleList: [],

    starList: [],

    paths: true,
    frameCount: 0
};

function distance(obj1, obj2) {
    return Math.sqrt((obj1.x - obj2.x)**2 + (obj1.y - obj2.y)**2);
}

class Planet {

    GRAV_CONSTANT = 2;

    constructor(x, y, dx, dy, mass) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.accelx = 0;
        this.accely = 0;
        this.mass = mass;
        this.ID = Simulation.planetCount;
        Simulation.planetCount++;
    }

    getRadius() {
        return 10 * Math.log2(this.mass + 1);
    }

    calcGravity() {
        var accelVect = [0,0];
        for (let i = 0; i < Simulation.planetList.length; i++) {
            let planeti = Simulation.planetList[i];
            if (planeti.ID != this.ID) {
                let planetdist = distance(this,planeti);
                let force = (planeti.mass) / (planetdist**2);
                //let forcex = (this.mass * planeti.mass) / ((this.x - planeti.x)**2);
                //let forcey = (this.mass * planeti.mass) / ((this.y - planeti.y)**2);
                let forcex = this.GRAV_CONSTANT * force * ((planeti.x - this.x) / planetdist);
                let forcey = this.GRAV_CONSTANT * force * ((planeti.y - this.y) / planetdist);

                accelVect[0] += forcex;
                accelVect[1] += forcey;
            }
        }
        this.accelx = accelVect[0];
        this.accely = accelVect[1];
    }

    move() {
        this.dx += this.accelx;
        this.dy += this.accely;
        this.x += this.dx;
        this.y += this.dy;

        // Cull Planets too far away
        if (distance(this, {x:0,y:0}) > 5000) {
            deletePlanet(this.ID);
        }

        // Planet Collisions
        for (let i = 0; i < Simulation.planetList.length; i++) {
            let planeti = Simulation.planetList[i];
            if (planeti.ID != this.ID) {
                if (distance(this,planeti) < this.getRadius() + planeti.getRadius()) {
                    
                    let impactpos = {x: this.x, y: this.y};
                    if (this.mass < planeti.mass) {
                        // Summon particles
                        let impactangle = Math.tan((planeti.y - this.y) / (planeti.x - this.x));
                        impactpos.x += Math.cos(impactangle) * this.getRadius();
                        impactpos.y += Math.sin(impactangle) * this.getRadius();
                        console.log(impactpos);
                        let numparticles = Math.ceil(Math.random() * 20) + 20;
                        for (let i = 0; i < numparticles; i++) {
                            let newparticle = new Particle(impactpos.x, impactpos.y, impactangle);
                            Simulation.particleList.push(newparticle);
                        }

                        // Conserve momentum
                        // m1v1 + m2v2 = (m1+m2)v3
                        planeti.dx = ((planeti.mass * planeti.dx) + (this.mass * this.dx)) / (planeti.mass + this.mass);
                        planeti.dy = ((planeti.mass * planeti.dy) + (this.mass * this.dy)) / (planeti.mass + this.mass);

                        // Move to center of mass
                        planeti.x += (this.x - planeti.x) * (this.mass / (planeti.mass + this.mass));
                        planeti.y += (this.y - planeti.y) * (this.mass / (planeti.mass + this.mass));

                        planeti.mass += this.mass;
                        deletePlanet(this.ID);
                        
                    }
                    else {
                        // Summon particles
                        let impactangle = Math.tan((this.y - planeti.y) / (this.x - planeti.x));
                        impactpos.x += Math.cos(impactangle) * planeti.getRadius();
                        impactpos.y += Math.sin(impactangle) * planeti.getRadius();
                        console.log(impactpos);
                        let numparticles = Math.ceil(Math.random() * 20) + 20;
                        for (let i = 0; i < numparticles; i++) {
                            let newparticle = new Particle(impactpos.x, impactpos.y, impactangle);
                            Simulation.particleList.push(newparticle);
                        }

                        this.dx = ((planeti.mass * planeti.dx) + (this.mass * this.dx)) / (planeti.mass + this.mass);
                        this.dy = ((planeti.mass * planeti.dy) + (this.mass * this.dy)) / (planeti.mass + this.mass);

                        this.x += (planeti.x - this.x) * (planeti.mass / (this.mass + planeti.mass));
                        this.y += (planeti.y - this.y) * (planeti.mass / (this.mass + planeti.mass));

                        this.mass += planeti.mass;
                        deletePlanet(planeti.ID);
                    }

                    //console.log(Simulation.planetList);
                }
            }
        }
    }
}

function deletePlanet(id) {
    for (let i = 0; i < Simulation.planetList.length; i++) {
        if (Simulation.planetList[i].ID === id) {
            Simulation.planetList.splice(i,1);
        }
    }
}





function startNewPlanet(e) {
    //console.log("starting planet at " + e);
    Simulation.protoplanet.x = e.offsetX;
    Simulation.protoplanet.y = e.offsetY;
    Simulation.createPlanet = true;
    Simulation.mousepos.x = e.offsetX;
    Simulation.mousepos.y = e.offsetY;
}

function addPlanet(e) {

    if (Simulation.createPlanet) {
    
        let x = Simulation.protoplanet.x;
        let y = Simulation.protoplanet.y;
        let mass = Simulation.protoplanet.mass;
        let dx = (x - e.offsetX) / 50;
        let dy = (y - e.offsetY) / 50;

        //console.log("creating planet at " + x + ", " + y);

        let newplanet = new Planet(x, y, dx, dy, mass);
        Simulation.planetList.push(newplanet);

        Simulation.createPlanet = false;
    }

}


function changeVel(e) {
    if (Simulation.createPlanet) {
        //console.log("velocity is: ");
        let mouseIn = {x: e.offsetX, y: e.offsetY};
        Simulation.mousepos.x = mouseIn.x;
        Simulation.mousepos.y = mouseIn.y;
    }
}





function drawPlanets() {
    let canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        let draw2d = canvas.getContext("2d");

        draw2d.clearRect(0,0, 800,500);

        draw2d.fillStyle = "darkgray";

        draw2d.beginPath();
        for (let i = 0; i < Simulation.planetList.length; i++) {
            let pos = {x: Simulation.planetList[i].x,
                       y: Simulation.planetList[i].y
            }
            draw2d.moveTo(pos.x,pos.y);
            draw2d.arc(pos.x, pos.y, Simulation.planetList[i].getRadius(), 0,2*Math.PI, true);
        }
        draw2d.fill();


        if (Simulation.createPlanet) {
            let newplanet = Simulation.protoplanet;
            let displaymass = 10 * Math.log2(Simulation.protoplanet.mass + 1)
            draw2d.beginPath();
            draw2d.arc(newplanet.x, newplanet.y, displaymass, 0,2*Math.PI, true);
            draw2d.fill();
            
            draw2d.strokeStyle = "red";
            draw2d.beginPath();
            draw2d.moveTo(newplanet.x, newplanet.y);
            draw2d.lineTo(Simulation.mousepos.x, Simulation.mousepos.y);
            draw2d.stroke();
        }

    }
    
}




class Particle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;

        let normal = angle + (Math.floor(Math.random() * 2) * 2 - 1) * (Math.PI / 2);
        this.angle = normal + (Math.random() / 2);

        this.life = Math.floor(Math.random() * 50) + 75;
        this.speed = Math.random() * 2;
    }

    move() {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);

        this.life--;
    }

    drawParticle() {
        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            var draw2d = canvas.getContext("2d");

            draw2d.fillStyle = "orange";

            draw2d.beginPath();
            draw2d.moveTo(this.x, this.y);
            draw2d.arc(this.x, this.y, 1, 0,2*Math.PI, true);
            draw2d.fill();
        }
    }
}








class Star {
    constructor() {
        this.x = Math.floor(Math.random() * 800);
        this.y = Math.floor(Math.random() * 500);
        this.luminosity = Math.random() * 1.4;
    }
}

function drawStars() {
    var canvas = document.getElementById("canvasBG");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        draw2d.clearRect(0,0, 800,500);

        draw2d.fillStyle = "white";
        

        draw2d.beginPath();
        for (let i = 0; i < Simulation.starList.length; i++) {
            let stari = Simulation.starList[i];
            draw2d.moveTo(stari.x, stari.y);
            draw2d.arc(stari.x, stari.y, stari.luminosity, 0,2*Math.PI, true);
        }
        draw2d.fill();
    }
}


function drawPaths() {
    var canvas = document.getElementById("paths");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        draw2d.fillStyle = "blue";

        draw2d.beginPath();
        for (let i = 0; i < Simulation.planetList.length; i++) {
            let planeti = Simulation.planetList[i];
            draw2d.moveTo(planeti.x, planeti.y);
            draw2d.arc(planeti.x, planeti.y, 1, 0,2*Math.PI, true);
        }
        draw2d.fill();
    }
}

function togglePaths() {
    
    if (Simulation.paths) {
        document.getElementById("paths").getContext("2d").clearRect(0,0, 800,500);
    }

    Simulation.paths = !Simulation.paths;
}


function setMass() {
    Simulation.protoplanet.mass = parseFloat(document.getElementById("massinput").value);
}



function start(type=1) {
    document.getElementById("paths").getContext("2d").clearRect(0,0, 800,500);

    while (Simulation.starList.length > 0) {
        Simulation.starList.pop();
    }
    for (let i = 0; i < Math.floor(Math.random() * 200) + 500; i++) {
        let newstar = new Star();
        Simulation.starList.push(newstar);
    }
    drawStars();

    while (Simulation.planetList.length > 0) {
        Simulation.planetList.pop();
    }

    if (type === 1) {
        // Momentum transfer
        let test1 = new Planet(350, 250, 2, 0, 8);
        let test2 = new Planet(650, 250, -9, 1, 2);
        Simulation.planetList.push(test1);
        Simulation.planetList.push(test2);
    }
    else if (type === 2) {
        // Body count test
        for (let i = 0; i < 750; i++) {
            let randx = Math.floor(Math.random() * 800);
            let randy = Math.floor(Math.random() * 500);
            let randmass = Math.random() * 3;
            let randPlanet = new Planet(randx, randy, 0, 0, randmass);
            Simulation.planetList.push(randPlanet);
        }
    }
    else if (type === 3) {
        // Orbit
        let test1 = new Planet(400, 250, 0, 0, 20);
        let test2 = new Planet(250, 250, 0, -0.5, 2);
        //let test3 = new Planet(500, 400, 0, 0, 5);
        let test4 = new Planet(475, 250, 0, 0.8, 1.5);
        Simulation.planetList.push(test1);
        Simulation.planetList.push(test2);
        //Simulation.planetList.push(test3);
        Simulation.planetList.push(test4);
    }

    //console.log("starting...");
    if (!Simulation.running) {
        Simulation.running = true;
        loop();
        
    }
}

function loop() {

    for (let i = 0; i < Simulation.planetList.length; i++) {
        Simulation.planetList[i].calcGravity();
    }
    for (let i = 0; i < Simulation.planetList.length; i++) {
        Simulation.planetList[i].move();
    }
    drawPlanets();
    //console.log(Simulation.planetList[1].y);

    for (let i = 0; i < Simulation.particleList.length; i++) {
        Simulation.particleList[i].move();
        Simulation.particleList[i].drawParticle();
        if (Simulation.particleList[i].life <= 0)
            Simulation.particleList.splice(i,1);
    }

    if (Simulation.paths && Simulation.frameCount % 10 === 0)
        drawPaths();

    if (Simulation.running)
        Simulation.frameCount++;
        window.requestAnimationFrame(loop);
}

//document.getElementById("startbutton").addEventListener("mousedown", loop);