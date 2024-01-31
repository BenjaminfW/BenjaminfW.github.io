/*var star = {
    pos : [0,0],
    speed : 5,
    dir : [1,0],
    size : 1,
    color : "white"
};*/
function Star() {
    this.pos = [0,0];
    this.speed = 5;
    this.dir = [1,0];
    this.size = 1;
    this.color = "white";
}

var starlist = [];

document.getElementById("starfield").style.backgroundColor = "black";
const W = document.getElementById("starfield").width;
document.getElementById("starfield").height = parseFloat(W * (9 / 16));
const H = document.getElementById("starfield").height;

console.log("width: " + W + ", height: " + H);

function dist2center(x,y) { return Math.sqrt( Math.pow(x - (W/2), 2) + Math.pow(y - (H/2), 2)); }

function initStarField() {

    document.getElementById("starbutton").style.display = "none";

    for (let i = 0; i < W*H/100; i++) {
        let newstar = new Star();
        newstar.pos = [Math.floor(Math.random() * W), Math.floor(Math.random() * H)];
        newstar.speed = Math.ceil(Math.random() * 8);
        newstar.size = Math.random();

        let dist = dist2center(newstar.pos[0], newstar.pos[1]);
        newstar.dir[0] = (newstar.pos[0] - (W/2)) / dist;
        newstar.dir[1] = (newstar.pos[1] - (H/2)) / dist;


        starlist.push(newstar);
    }

    console.log(starlist);

    warpSpeed();
}


function warpSpeed() {

    //console.log("drawing new frame")

    // Update star positions
    for (let i = 0; i < starlist.length; i++) {
        starlist[i].pos[0] += starlist[i].dir[0] * starlist[i].speed / 10;
        starlist[i].pos[1] += starlist[i].dir[1] * starlist[i].speed / 10;

        let boundleft = starlist[i].pos[0] < 0;
        let boundright = starlist[i].pos[0] > W;
        let boundtop = starlist[i].pos[1] < 0;
        let boundbottom = starlist[i].pos[1] > H;
        if (boundleft || boundright || boundtop || boundbottom) {
            starlist[i].pos[0] = W/2;
            starlist[i].pos[1] = H/2;
        }
    }

    // Draw the new frame
    let canvas = document.getElementById("starfield");
    let draw2d = canvas.getContext("2d");

    draw2d.clearRect(0,0,W,H);

    for (let i = 0; i < starlist.length; i++) {
        let dist = dist2center(starlist[i].pos[0], starlist[i].pos[1]);
        if (dist > 5) {
            draw2d.fillStyle = starlist[i].color;
            draw2d.beginPath();
            draw2d.arc(starlist[i].pos[0],starlist[i].pos[1], starlist[i].size, 0,2*Math.PI, true);
            draw2d.fill();
        }
    }

    window.requestAnimationFrame(warpSpeed);
}