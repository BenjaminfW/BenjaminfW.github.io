var car = {
    position: [0,0],//[400,250],
    direction: 0,
    
    speed: 0,
    acceleration: 0,
    max_speed: 5,

    turning_speed: 0,
    turn_accel: 0,
    max_turn_speed: 0.03,
    drifting: false,

    //boost_build: 0,
    boost: 0
}


var physics_objects = [];

function drawCar() {
    var canvas = document.getElementById("carvas");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        /*const carSize = 9;
        const angleOffset = Math.PI / 5;
        const points = [[carSize*Math.cos(direction+angleOffset), carSize*Math.sin(direction+angleOffset)],
                        [carSize*Math.cos(direction+angleOffset), carSize*Math.sin(direction-angleOffset)],
                        [carSize*Math.cos(direction-angleOffset), carSize*Math.sin(direction-angleOffset)],
                        [carSize*Math.cos(direction-angleOffset), carSize*Math.sin(direction+angleOffset)]]

        draw2d.beginPath();
        draw2d.moveTo(car.position[0] + points[0][0],car.position[1] + points[0][1])
        draw2d.moveTo(car.position[0] + points[1][0],car.position[1] + points[1][1])
        //more*/

        draw2d.save();
        draw2d.fillStyle = "blue";
        draw2d.translate(car.position[0],car.position[1]);
        if (car.drifting) {
            if (car.turning_speed < 0)
                draw2d.rotate(car.direction - (Math.PI/6));
            if (car.turning_speed > 0)
                draw2d.rotate(car.direction + (Math.PI/6));
        }
        else
            draw2d.rotate(car.direction);

        draw2d.fillRect(-9,-5, 18,10);
        draw2d.fillStyle = "lightblue";
        draw2d.fillRect(2,-4, 3,8);
        draw2d.fillRect(-7,-4, 2,8)
        draw2d.restore();
    }
}

function drawTrack() {
    var canvas = document.getElementById("carvas");
    if (canvas.getContext) {
        var draw2d = canvas.getContext("2d");

        //draw2d.fillStyle = "green";
        //draw2d.arc(0,0, 100, 0,2*Math.PI, True);
        draw2d.beginPath();
        draw2d.fillStyle = "gray";
        draw2d.arc(0,0, 500, 0,2*Math.PI, true);
        draw2d.fill()
        draw2d.beginPath();
        draw2d.fillStyle = "green";
        draw2d.arc(0,0, 350, 0,2*Math.PI, true);
        draw2d.fill();

    }
}



onkeydown = (e) => {
    //console.log(car)
    let alertelement = document.getElementById("showkey");
    switch(e.code) {
        case "ArrowUp":
            car.acceleration = 0.2;
            alertelement.innerHTML = "Up";
            break;
        case "ArrowDown":
            car.acceleration = -0.13;
            alertelement.innerHTML = "Down";
            break;
        case "ArrowLeft":
            car.turn_accel = -0.01;
            alertelement.innerHTML = "Left";
            break;
        case "ArrowRight":
            car.turn_accel = 0.01;
            alertelement.innerHTML = "Right"
            break;
        case "Space":
            car.drifting = true;
            car.max_turn_speed = 0.06;
            alertelement.innerHTML = "Space";
            break;
    }
    /*
    if (e.code === "ArrowUp")
        car.acceleration = 0.2;
    if (e.code === "ArrowDown")
        car.acceleration = -0.13
    if (e.code === "ArrowLeft")
        car.turning_speed = -0.03;
    if (e.code === "ArrowRight")
        car.turning_speed = 0.03;
    */
}

onkeyup = (e) => {
    switch(e.code) {
        case "ArrowUp":
            car.acceleration = 0;
            break;
        case "ArrowDown":
            car.acceleration = 0;
            break;
        case "ArrowLeft":
            car.turn_accel = 0;
            break;
        case "ArrowRight":
            car.turn_accel = 0;
            break;
        case "Space":
            car.drifting = false;
            car.max_turn_speed = 0.03;
            car.speed += car.boost;
            car.boost = 0;
            if (car.turn_accel < 0)
                car.direction -= Math.PI/6;
            if (car.turn_accel > 0)
                car.direction += Math.PI/6;
            break;
    }
    /*
    if (e.code === "ArrowUp")
        car.acceleration = 0;
    if (e.code === "ArrowDown")
        car.acceleration = 0;
    if (e.code === "ArrowLeft")
        car.turning_speed = 0;
    if (e.code === "ArrowRight")
        car.turning_speed = 0;
    */
}

function loop() {
    
    if (car.speed < car.max_speed && car.speed > (-1*car.max_speed/2))
        car.speed += car.acceleration;
    if (car.acceleration === 0 || car.speed > car.max_speed) {
        if (car.speed > 0.07)
            car.speed -= 0.07;
        else if (car.speed < -0.07)
            car.speed += 0.07;
        else
            car.speed = 0;
    }
    car.position[0] += Math.cos(car.direction) * car.speed;
    car.position[1] += Math.sin(car.direction) * car.speed;

    
    if (car.turning_speed < car.max_turn_speed && car.turning_speed > -1*car.max_turn_speed)
        car.turning_speed += car.turn_accel;
    if (car.turn_accel === 0) {
        if (car.turning_speed < -0.01)
            car.turning_speed += 0.01;
        else if (car.turning_speed > 0.01)
            car.turning_speed -= 0.01;
        else
            car.turning_speed = 0;
    }
    car.direction += car.turning_speed * (car.speed / 5);
    if (car.drifting && car.boost < 15)
        car.boost += 0.01;

    

    var draw2d = document.getElementById("carvas").getContext("2d");

    draw2d.clearRect(0,0, 800,500);
    draw2d.save();
    
    draw2d.translate(-1*car.position[0]+(800/2), -1*car.position[1]+(500/2));
    //draw2d.rotate(car.direction + (Math.PI/2));
    drawTrack();
    drawCar();
    //showSections();
    draw2d.restore();


    window.requestAnimationFrame(loop);
}
