class Interactable {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.activated = false;
        this.activated_prev = false;
    }
}

function detectInteractables() {
    for (let i = 0; i < game.interactList.length; i++) {
        var interactable = game.interactList[i];

        interactable.activated_prev = interactable.activated;

        if (Math.abs(player.x - interactable.x) < (interactable.width/2) + (player.width/2) &&
            Math.abs(player.y - interactable.y) < (interactable.height/2) + (player.width/2))

            game.interactList[i].activated = true;

        else
            game.interactList[i].activated = false;

    }
}



function drawInteractables(draw2d) {
    draw2d.save();
    
    for (let i = 0; i < game.interactList.length; i++) {
        var interactable = game.interactList[i];
        if (interactable.activated)
            draw2d.fillStyle = "red";
        else
            draw2d.fillStyle = "green";
        draw2d.fillRect(interactable.x-(interactable.width/2),interactable.y-(interactable.height/2),
                        interactable.width,interactable.height);
    }
    draw2d.restore();
}


