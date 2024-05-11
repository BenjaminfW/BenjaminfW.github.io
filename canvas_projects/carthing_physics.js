class PhysicsCircle {
    constructor(position, radius) {
        this.type = "circle";
        this.position = position;
        this.radius = radius;
    }
    
    checkIntersection(playerposition) {
        if (Math.sqrt((playerposition[0]-this.position[0])**2 + (playerposition[1]-this.position[1])**2) < this.radius)
            return true;
        else
            return false;
    }
}

class PhysicsRectangle {
    constructor(position, width, height, angle) {
        this.type = "rect";
        this.position = position;
        this.width = width;
        this.height = height;
        this.angle = angle;
    }
    
    checkIntersection(playerposition) {
        const playerrelative = [
            playerposition[0] * Math.cos(this.angle),
            playerposition[1] * Math.sin(this.angle)
            ];
        
        const isinsideLeft = (playerrelative[0] > this.position[0] - (this.width/2));
        const isinsideRight = (playerrelative[0] < this.position[0] + (this.width/2));
        const isinsideTop = (playerrelative[1] < this.position[1] - (this.height/2));
        const isinsideBottom = (playerrelative[1] > this.position[1] + (this.height/2));
        
        if (isinsideLeft && isinsideRight && isinsideTop && isinsideBottom)
            return true;
        else
            return false;
    }
}

class PhysicsSection {
    constructor() {
        this.objects = [];
    }
    
}

class PhysicsObject {
    constructor(shape) {
        this.shape = shape;
    }
    
    process() {
        if (this.shape.checkIntersection(car.position)) {
        
        }
    }
}

// Define Physics Sections
const grass = new PhysicsCircle([0,0], 350);
const startLine = new PhysicsRectangle([-425,0], 200, 50, 0);

const grassSection = {
    body: new PhysicsCircle([0,0], 350),
    
    center: new PhysicsCircle([0,0], 200)
}


// Compile them
var physicsSections = [grass, startLine];

function showSections() {
    var canvas = document.getElementById("carvas");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");
        draw2d.strokeStyle = "black";
        
        for (let i = 0; i < physicsSections.length; i++) {
            var section = physicsSections[i];
            if (section.type === "circle") {
                draw2d.beginPath();
                draw2d.arc(section.position[0], section.position[1], section.radius, 0,2*Math.PI, true);
                draw2d.stroke();
            }
            if (section.type === "rect") {
                draw2d.save();
                draw2d.rotate(section.angle);
                draw2d.translate(section.position[0], section.position[1]);
                
                draw2d.strokeRect(-1*(section.width/2), -1*(section.height/2),
                                    section.width, section.height);
                draw2d.restore();
            }
        }
    }
}

function checkSections() {
    
    
    
}

