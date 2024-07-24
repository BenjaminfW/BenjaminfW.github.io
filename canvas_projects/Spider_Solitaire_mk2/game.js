var Game = {
    table: [
        [], [], [], [], [], [], [], [], [], []
    ],

    deck: [],
    winDeck: [],

    selectedMD: [-1,-1],
    selectedMU: [-1,-1],

    win: false,

    moveList: [],

    active: false
};

function createBoard() {
    var W = document.getElementById("canvas").width;
    var H = document.getElementById("canvas").height;

    Game.Board = new BoardDisp(W, H);
    //console.log(Game);
}



function render() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d");

        drawBoard(ctx);

    }
}



function checkInputMouseDown() {
    var valid_movefrom0 = (Game.selectedMD[0] > -1 && Game.selectedMD[0] < Game.table.length);
    var valid_movefrom1 = (Game.selectedMD[1] > -1 && Game.selectedMD[1] < Game.table[Game.selectedMD[0]].length);
    var movefrom0_draw = (Game.selectedMD[0] === Game.table.length - 1);
    var movefrom1_draw = (Game.selectedMD[1] === Game.table[Game.table.length-1].length);

    if (valid_movefrom0 && valid_movefrom1)
        return 1;
    else if (movefrom0_draw && movefrom1_draw)
        return 2;
    else
        return 0;
}

function checkMoveMouseDown() {
    // Clicked on faceup card
    var selected_faceup = Game.table[Game.selectedMD[0]][Game.selectedMD[1]].faceUp;

    // Cards on top of selection form a run
    var valid_run = false;
    /*if (Game.selectedMD[1] < Game.table[Game.selectedMD[0]].length - 1) {
    
        var checkindex = Game.selectedMD[1] + 1;
        while (checkindex < Game.table[Game.selectedMD[0]].length && valid_run) {
            let card_previous = Game.table[Game.selectedMD[0]][checkindex - 1];
            let card_current = Game.table[Game.selectedMD[0]][checkindex];
            if (card_previous.face !== card_current.face + 1 && card_previous.suit !== card_current.suit)
                valid_run = false;
            checkindex++;
        }

    }*/
    var count = 0;
    var i = Game.table[Game.selectedMD[0]].length - 1;
    while (i > Game.selectedMD[1] &&
           Game.table[Game.selectedMD[0]][i].face === Game.table[Game.selectedMD[0]][i-1].face - 1 &&
           Game.table[Game.selectedMD[0]][i].faceUp &&
           Game.table[Game.selectedMD[0]][i].suit === Game.table[Game.selectedMD[0]][i-1].suit) {
        i--;
        count++;
    }

    if (count === Game.table[Game.selectedMD[0]].length-1 - Game.selectedMD[1])
        valid_run = true;

    //console.log(count);

    if (selected_faceup && valid_run)
        return true;
    else {
        if (!selected_faceup)
            console.log("selected face-down card");
        if (!valid_run)
            console.log("cards underneath are not consecutive");
        return selected_faceup && valid_run
    }

}


function checkInputMouseUp() {
    //console.log("Move from: "+Game.selectedMD + " | Move to: "+Game.selectedMU);

    var valid_moveto0 = (Game.selectedMU[0] > -1 && Game.selectedMU[0] < Game.table.length);
    var valid_moveto1 = (Game.selectedMU[1] < Game.table[Game.selectedMU[0]].length);

    var moveto_draw0 = (Game.selectedMU[0] === Game.table.length - 1);
    var moveto_draw1 = (Game.selectedMU[1] === Game.table[Game.table.length-1].length);

    if (valid_moveto0 && valid_moveto1)
        return 1;
    else if (moveto_draw0 && moveto_draw1)
        return 2;
    else
        return 0;
}


function dealDeck() {
    if (Game.deck.length > 0) {
        for (let i = 0; i < Game.table.length; i++) {
            Game.table[i].push(Game.deck[Game.deck.length-1]);
            Game.deck.pop();
        }

        Game.moveList.push(-1);

        render();
    }
}


function activateWinState() {
    Game.win = true;
    Game.active = false;
    //alert("win");
    initializeWinAnimation();
}







function findMoves(fromselected=false) {

    var movelist = [];

    for (let i = 0; i < Game.table.length; i++) {
        
        if (Game.table[i].length > 0) {

            // Find the bottommost movable card
            let search = Game.table[i].length - 1;
            //let card2move = Game.table[i][search];


            /*while (Game.table[i].length - search > 0) {
                if (card2move.face === Game.table[i][Game.table[i].length-1 - search].face - 1 &&
                    Game.table[i][Game.table[i].length-1 - search].faceUp) {
                    search++;
                    card2move = Game.table[i][Game.table[i].length-search];
                }
            }*/
            let searchend = 0;
            if (fromselected)
                searchend = Game.selectedMD[1];
            for (let j = search; j > searchend; j--) {
                if (Game.table[i][j-1].faceUp &&
                    Game.table[i][j].face === Game.table[i][j-1].face - 1 &&
                    Game.table[i][j].suit === Game.table[i][j-1].suit) {
                    search--;
                    //card2move = Game.table[i][j];
                }
                else break;
            }
            //console.log(search);
            card2move = Game.table[i][search];

            // Search the topmost card of each row for a move
            for (let j = 0; j < Game.table.length; j++) {
                if (j !== i) {

                    if (Game.table[j].length === 0) {
                        let newmove = {
                            movefrom: [i, search],
                            moveto: [j,0]
                        };

                        movelist.push(newmove);
                    }
                    else {
                        //let matching_suit = (card2move.suit === Game.table[j][Game.table[j].length-1].suit);
                        let right_number = (card2move.face === Game.table[j][Game.table[j].length-1].face - 1);
                        if (/*matching_suit && */right_number) {
                            let newmove = {
                                movefrom: [i, search],
                                moveto: [j, Game.table[j].length-1]
                            }
                    
                            movelist.push(newmove);
                    
                        }
                    }

                }
            }

        }

        
        
    }

    return movelist;

    //console.log(movelist);
}


function findHint() {

    let hintlist = findMoves();

    if (hintlist.length === 0) {
        if (Game.deck.length > 0)
            showHint(-1);
        else
            alert("lose");
    }
    else {
        var randhint = hintlist[Math.floor(Math.random() * hintlist.length)];
        showHint(randhint);
    }
}


function autoMove() {
    let movelist = findMoves(true);
    //console.log(movelist);

    let clickmoves = [];

    for (let i = 0; i < movelist.length; i++) {
        if (movelist[i].movefrom[0] === Game.selectedMD[0]) {
            

            clickmoves.push(movelist[i]);

            
        }
    }

    if (clickmoves.length > 0) {
        let randmove = Math.floor(Math.random() * clickmoves.length);
        Game.selectedMU[0] = clickmoves[randmove].moveto[0];
        Game.selectedMU[1] = clickmoves[randmove].moveto[1];
        if (checkMoveMouseDown() && checkMoveMouseUp())
            makeMove();
    }

}



function checkWin(row) {
    if (Game.table[row][Game.table[row].length-1].face === 0 && Game.table[row].length > 12) {
        var count = 0;
        var i = Game.table[row].length - 1;
        while (i > 0 &&
               Game.table[row][i].face === Game.table[row][i-1].face - 1 &&
               Game.table[row][i].faceUp &&
               Game.table[row][i].suit === Game.table[row][i-1].suit) {

            i--;
            count++;
        }

        if (count === 12) {
            Game.winDeck.push(Game.table[row][i].suit);
            for (let i = 0; i < 13; i++)
                Game.table[row].pop();
            if (Game.table[row].length > 0) {
                if (!Game.table[row][Game.table[row].length-1].faceUp)
                    Game.table[row][Game.table[row].length-1].flip();
            }
            if (Game.winDeck.length === 8)
                activateWinState();
        }
    }
}




function makeMove() {
    for (let i = Game.selectedMD[1]; i < Game.table[Game.selectedMD[0]].length; i++) {
        Game.table[Game.selectedMU[0]].push(Game.table[Game.selectedMD[0]][i]);
    }
    while (Game.table[Game.selectedMD[0]].length > Game.selectedMD[1])
        Game.table[Game.selectedMD[0]].pop();
    //console.log(Game.table[Game.selectedMU[0]]);

    let move = {
        from: [Game.selectedMD[0], Game.selectedMD[1]],
        to: [Game.selectedMU[0], Game.selectedMU[1]],
        flipped: false
    };
    Game.moveList.push(move);

    checkWin(Game.selectedMU[0]);

    // Flip over any exposed cards
    if (Game.table[Game.selectedMD[0]].length > 0)
        if (!Game.table[Game.selectedMD[0]][Game.table[Game.selectedMD[0]].length-1].faceUp) {
            Game.table[Game.selectedMD[0]][Game.table[Game.selectedMD[0]].length-1].flip();
            move.flipped = true;
        }
}








function checkMoveMouseUp() {

    
    // End card is 1 greater than selection
    var valid_move = false;
    if (Game.table[Game.selectedMU[0]].length === 0)
        valid_move = true;
    else {
        let movefromcard = Game.table[Game.selectedMD[0]][Game.selectedMD[1]];
        let movetocard = Game.table[Game.selectedMU[0]][Game.table[Game.selectedMU[0]].length-1];
        valid_move = (movefromcard.face === movetocard.face - 1);
    }

    //console.log(selected_faceup+","+valid_run+","+valid_move);

    return valid_move;

    //render();

}


function undoMove() {

    if (Game.moveList[Game.moveList.length-1] === -1) {

        for (let i = Game.table.length-1; i >= 0; i--) {
            Game.deck.push(Game.table[i][Game.table[i].length-1]);
            Game.table[i].pop();
        }

    }
    else {
        //console.log(Game.moveList[Game.moveList.length-1]);
        let move2undo = Game.moveList[Game.moveList.length-1];
        let movefrom = move2undo.to;
        let moveto = move2undo.from;
        movefrom[1] += 1;
        //console.log("Moving " + movefrom + " to " + moveto);

        if (move2undo.flipped)
            Game.table[moveto[0]][moveto[1]-1].flip();

        for (let i = movefrom[1]; i < Game.table[movefrom[0]].length; i++) {
            Game.table[moveto[0]].push(Game.table[movefrom[0]][i]);
        }
        while (Game.table[movefrom[0]].length > movefrom[1])
            Game.table[movefrom[0]].pop();

    }

    Game.moveList.pop();

    render();
}






// Input events

onmousedown = (e) => {
    if (Game.active) {
        var mouseIn = {
            x: e.offsetX,
            y: e.offsetY
        };

        Game.selectedMD[0] = Game.Board.findRow(mouseIn.x);
        Game.selectedMD[1] = Game.Board.findCol(Game.table[Game.selectedMD[0]].length, mouseIn.y);

        // Animation stuff
        if (checkInputMouseDown() === 1 && checkMoveMouseDown()) {
            anim.dragCard = Game.selectedMD;
            anim.dragpos.x = mouseIn.x;
            anim.dragpos.y = mouseIn.y;
            anim.dragoffset.xdiff = mouseIn.x - Game.Board.findDrawX(Game.selectedMD[0]);
            anim.dragoffset.ydiff = mouseIn.y - Game.Board.findDrawY(Game.table[Game.selectedMD[0]].length, Game.selectedMD[1]);
            anim.dragging = true;
            animateDrag();
        }
    }
}

onmouseup = (e) => {
    if (Game.active) {
        var mouseIn = {
            x: e.offsetX,
            y: e.offsetY
        };

        //console.log(Game.Board.findRow(mouseIn.x));
        //console.log(Game.Board.findCol(Game.table[Game.selectedMU[0]].length, mouseIn.y));

        Game.selectedMU[0] = Game.Board.findRow(mouseIn.x);
        Game.selectedMU[1] = Game.Board.findCol(Game.table[Game.selectedMU[0]].length, mouseIn.y);


        if (checkInputMouseDown() === 1 && checkInputMouseUp() === 1) {

            if (Game.selectedMD[0] === Game.selectedMU[0] && anim.dragdist < 10) {
                autoMove();
                //initializeAutoMoveAnimation(50);
                render();
            }
            else {
                if (checkMoveMouseDown() && checkMoveMouseUp()) {

                    makeMove();
                    
                }
                render();
            }
            
        }
        else if (checkInputMouseDown() === 2 && checkInputMouseUp() === 2)
            dealDeck();


        /*if  {
            if (checkInputMouseDown() === 1 && checkInputMouseUp() === 1)
                autoMove();
        }*/


        // Animation stuff
        anim.dragging = false;
        anim.dragdist = 0;
    }
}

onmousemove = (e) => {
    if (anim.dragging) {
        var mouseIn = {
            x: e.offsetX,
            y: e.offsetY
        };

        //if (anim.dragdist < 10 && anim.dragdist + distance(anim.dragpos, mouseIn) >= 10)
        //    animateDrag();

        anim.dragdist += distance(anim.dragpos, mouseIn);

        anim.dragpos = {
            x: mouseIn.x,
            y: mouseIn.y
        };
    }
}


onkeydown = (e) => {
    if (Game.active) {
        if (e.code === "KeyH")
            findHint();
        // "D" for "Debug"
        if (e.code === "KeyD")
            console.log(Game);
    }
}









// Game initialization

function startGame(numsuits) {

    let debugDeck = false;

    Game.table = [
        [], [], [], [], [], [], [], [], [], []
    ];
    Game.winDeck = [];
    Game.moveList = [];

    var deckunshuffled = [];
	
    // Generate Cards
	if (numsuits === 1) {
		for (let i = 0; i < 8*13; i++) {
			let faceval = i % 13;
			let newCard = new Card(faceval, "s");
			deckunshuffled.push(newCard);
		}
	}
	else if (numsuits === 2) {
		for (let i = 0; i < 4*13; i++) {
			let faceval = i % 13;
			let newCard = new Card(faceval, "s");
			deckunshuffled.push(newCard);
		}
		for (let i = 0; i < 4*13; i++) {
			let faceval = i % 13;
			let newCard = new Card(faceval, "h");
			deckunshuffled.push(newCard);
		}
	}
	
	Game.deck = [];
	
	// Shuffle the deck
    if (!debugDeck) {
    	for (let i = 0; i < 8*13; i++) {
	    	let randcard = Math.floor(Math.random() * deckunshuffled.length);
		
	    	Game.deck.push(deckunshuffled[randcard]);
	    	
	    	for (let j = randcard; j < deckunshuffled.length-1; j++)
	    		deckunshuffled[j] = deckunshuffled[j+1];
	    	deckunshuffled.pop();
	    }
    }
    else {
        for (let i = 0; i < deckunshuffled.length; i++)
            Game.deck.push(deckunshuffled[i]);
    }
	
	// Deal the deck
	for (let i = 0; i < 44; i++) {
		Game.deck[Game.deck.length-1].flip();
		Game.table[i%10].push(Game.deck[Game.deck.length-1]);
		Game.deck.pop();
	}
	for (let i = 44; i < 54; i++) {
		Game.table[i%10].push(Game.deck[Game.deck.length-1]);
		Game.deck.pop();
	}

    Game.active = true;

    render();
}
