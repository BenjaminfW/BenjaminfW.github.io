class Ceiling {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;

        this.width = width;
    }
}

function checkCeiling() {

    for (let i = 0; i < game.levelGeometry.ceiling.length; i++) {

        var ceil = game.levelGeometry.ceiling[i];
        if (player.x > ceil.x && player.x < ceil.x+ceil.width) {
            if (player.dy < 0 &&
                player.y-(player.height/2) <= ceil.y &&
                player.y_prev-(player.height/2) > ceil.y) {

                    player.y = ceil.y+(player.height/2)
                    player.dy = 0;

                }

        }

    }

}

function drawCeiling(draw2d) {

    draw2d.beginPath();
    for (let i = 0; i < game.levelGeometry.ceiling.length; i++) {
        let ceil = game.levelGeometry.ceiling[i];
        
        draw2d.moveTo(ceil.x, ceil.y);
        draw2d.lineTo(ceil.x+ceil.width, ceil.y);
    }
    draw2d.stroke();
}