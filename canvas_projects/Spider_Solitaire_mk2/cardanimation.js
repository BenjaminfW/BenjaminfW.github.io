var anim = {
    dragging: false,
    dragCard: [-1,-1],
    dragpos: {x:0, y:0},
    dragoffset: {xdiff:0, ydiff:0},
    dragdist: 0,

    autoCard: [-1,-1],
    //autopos: {x: 0, y: 0},
    //autovect: [0,0],
    autoposlist: [],
    automovei: -1,

    winpositions: [],
    winvects: [],
    winspeeds: [],
    winlife: [],
    winvalues: []
}

function distance(pos1, pos2) { return Math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2); }

function animateDrag() {

    //console.log(anim.dragoffset);

    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");


        if (anim.dragging && anim.dragCard[0] > -1 && anim.dragCard[1] > -1) {
            drawBoard(ctx, anim.dragCard);

            // Card Shadow
            if (anim.dragdist > 10) {
                let shadowx = anim.dragpos.x - anim.dragoffset.xdiff;
                let shadowy = anim.dragpos.y - anim.dragoffset.ydiff;
                ctx.fillStyle = "rgba(30, 50, 35, 0.75)";
                let shadowwidth = Game.Board.width + 12;
                let shadowheight = /*Game.Board.findDrawY(Game.table[anim.dragCard[0]].length, Game.table[anim.dragCard[0]].length-1) -
                                   Game.Board.findDrawY(Game.table[anim.dragCard[0]].length, anim.dragCard[1]) +*/
                                   (Game.table[anim.dragCard[0]].length-1 - anim.dragCard[1]) * Game.Board.vspacing +
                                   Game.Board.height + 12;

                fillRectCurved(ctx, shadowx + 12, shadowy + 12, shadowwidth, shadowheight, 5);
            }


            // Cards being dragged
            for (let i = anim.dragCard[1]; i < Game.table[anim.dragCard[0]].length; i++) {
                let cardx = anim.dragpos.x - anim.dragoffset.xdiff;
                let cardy = anim.dragpos.y - anim.dragoffset.ydiff + ((i-anim.dragCard[1]) * Game.Board.vspacing);

                drawCard(cardx, cardy, Game.table[anim.dragCard[0]][i]);
            }


            window.requestAnimationFrame(animateDrag);
        }
    }
}

function showHint(hint) {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        if (hint === -1) {
            let highlightx = Game.Board.findDrawX(Game.table.length-1) - 5;
            let highlighty = Game.Board.bottompart - 5;
            let highlightwidth = Game.Board.width + 10;
            let highlightheight = Game.Board.height + 10;
            fillRectCurved(ctx, highlightx,highlighty, highlightwidth,highlightheight, 5);

            let tempcard = new Card(0, undefined, false);
            drawCard(highlightx+5, highlighty+5, tempcard);
            ctx.fillStyle = "blue";
            ctx.fillText(Game.deck.length / 10,
                         highlightx+5 + Game.Board.width/2 - 4,
                         highlighty+5 + Game.Board.height/2 + 4
            )
        }
        else {
            let exception1 = hint.movefrom;
            let exception2 = hint.moveto;
            let exception = [exception1, exception2];
            //console.log(exception);

            drawBoard(ctx, exception);

            for (let i = 0; i < exception.length; i++) {
                let cardpos = exception[i];
            
                let highlightx = Game.Board.findDrawX(cardpos[0]) - 5;
                let highlighty = Game.Board.findDrawY(Game.table[cardpos[0]].length, cardpos[1]) - 5;

                let highlightwidth = Game.Board.width + 10;
                /*let highlightheight = Game.Board.vspacing * (Game.table[cardpos[0]].length-1 - cardpos[1]) +
                                      Game.Board.height + 10;*/
                let highlightheight = Game.Board.findDrawY(Game.table[cardpos[0]].length, Game.table[cardpos[0]].length-1) -
                                      Game.Board.findDrawY(Game.table[cardpos[0]].length, cardpos[1]) +
                                      Game.Board.height + 10;
                // highlightheight = y position of top card in row - y position of clicked card + card height + 10

                ctx.fillStyle = "royalblue";
                fillRectCurved(ctx, highlightx,highlighty, highlightwidth,highlightheight, 5);

                for (let j = cardpos[1]; j < Game.table[cardpos[0]].length; j++) {
                    let drawx = Game.Board.findDrawX(cardpos[0]);
                    let drawy = Game.Board.findDrawY(Game.table[cardpos[0]].length, j);
                    drawCard(drawx, drawy, Game.table[cardpos[0]][j]);
                }
            
            }
        }

    }
}



/*function initializeAutoMoveAnimation(animationLength) {

    anim.autoCard[0] = Game.selectedMU[0];
    anim.autoCard[1] = Game.selectedMU[1] + 1;
    anim.automovei = 0;

    let startpos = {x: Game.Board.findDrawX(Game.selectedMD[0]),
                    y: Game.Board.findDrawY(Game.table[Game.selectedMD[0]].length, Game.selectedMD[1])};

    let endpos = {x: Game.Board.findDrawX(Game.selectedMU[0]),
                  y: Game.Board.findDrawY(Game.table[Game.selectedMU[0]].length, Game.selectedMU[1])};

    console.log("moving from " + Game.selectedMD + " to " + Game.selectedMU);

    var animdist = distance(startpos, endpos);

    let movevect = [endpos.x - startpos.x, endpos.y - startpos.y];
    let movevectnorm = [movevect[0] / animdist, movevect[1] / animdist];

    // Generate the points that the card will travel along

    anim.autoposlist.push(startpos);

    // Yes, I could do this recursively, but I WON'T! HAHA
    /*for (let i = animationLength; i > 2; i--) {
        let animationposition = {
            x: startpos.x + movevectnorm[0] * (1/i) * animdist,
            y: startpos.y + movevectnorm[1] * (1/i) * animdist
        }
        anim.autoposlist.push(animationposition);
    }
    for (let i = 2; i <= animationLength; i++) {
        let animationposition = {
            x: startpos.x + movevectnorm[0] * (1 - (1/i)) * animdist,
            y: startpos.y + movevectnorm[1] * (1 - (1/i)) * animdist
        }
        anim.autoposlist.push(animationposition);
    }
    for (let i = 0; i < animationLength; i++) {
        /*let animationposition = {
            x: startpos.x + movevectnorm[0] * i * (animdist / animationLength),
            y: startpos.y + movevectnorm[1] * i * (animdist / animationLength)        
        };
        anim.autoposlist.push(animationposition);
        anim.autoposlist.push(endpos);
    }

    anim.autoposlist.push(endpos);

    animateAutoMove();

}

function animateAutoMove() {

    if (anim.automovei < anim.autoposlist.length) {

        let canvas = document.getElementById("canvas");
        if (canvas.getContext) {
            let ctx = canvas.getContext("2d");
            drawBoard(ctx, anim.autoCard);
        }

        for (let i = anim.autoCard[1]; i < Game.table[anim.autoCard[0]].length; i++) {
            let cardx = anim.autoposlist[anim.automovei].x;
            let cardy = anim.autoposlist[anim.automovei].y + ((i-anim.dragCard[1]) * Game.Board.vspacing);

            drawCard(cardx, cardy, Game.table[anim.autoCard[0]][i]);
        }

        anim.automovei++;

        window.requestAnimationFrame(animateAutoMove);

    }
    else {
        anim.autoposlist = [];
        anim.automovei = 0;

        render();
    }

}*/

function setWinInfo(i) {
    let ith_position = {x: Game.Board.findDrawX(i),
                            y: Game.Board.bottompart};
        anim.winpositions.push(i);

        let randvector = {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1};
        let ith_vect = [randvector.x / distance({x: 0, y: 0}, randvector),
                        randvector.y / distance({x: 0, y: 0}, randvector)];

        let randspeed = Math.ceil(Math.random() * 4);

        anim.winvects.push(ith_vect);
        anim.winspeeds.push(randspeed);
        anim.winlife.push(Math.ceil(Math.random() * 50 + 50));
}
function initializeWinAnimation() {
    for (let i = 0; i < Game.winDeck.length; i++) {
        setWinInfo(i);
        anim.winvalues[i] = 12;
    }

    winAnimation();
}
function winAnimation() {

    let finishcounter = 0;
    for (let i = 0; i < Game.winDeck.length; i++) {
        if (anim.winvalues[i] > 0) {
            let deltax = anim.winvects[i][0] * anim.winspeeds[i];
            let deltay = anim.winvects[i][1] * anim.winspeeds[i];
            anim.winpositions[i].x += deltax;
            anim.winpositions[i].y += deltay;
            if (anim.winpositions.x < 0 || anim.winpositions.x > Game.Board.W - Game.Board.width)
                anim.winvects[i][0] *= -1;
            if (anim.winpositions.y < 0 || anim.winpositions.y > Game.Board.H - Game.Board.height)
                anim.winvects[i][1] *= -1;

        
            if (anim.winlife[i] <= 0) {
                setWinInfo(i);
                anim.winvalues[i] -= 1;
            }
            else
                finishcounter += 1;

            let card2draw = new Card(anim.winvalues[i], Game.winDeck[i]);
            drawCard(anim.winpositions[i].x, anim.winpositions[i].y, card2draw);

        }
        
    }


    if (finishcounter < 12)
        window.requestAnimationFrame(winAnimation);
    else
        alert("win");
}
