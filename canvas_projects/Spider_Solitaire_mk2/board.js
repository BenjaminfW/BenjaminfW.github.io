class BoardDisp {
    /* This is a class created to solve a lot of issues with click detection.
    *  It was originally used in a previous version of FreeCell I made to
    *  determine which element the user clicked on.
    *  It can be abstracted to be used for general UI stuff.
    */


	constructor(elementW, elementH) {

        this.W = elementW,
        this.H = elementH,

        this.lmargin = Math.round(elementW / 32);
        this.width = 2 * this.lmargin;
        this.spacing = this.lmargin;
        this.offset = Math.round(this.spacing / 2);
		//this.lmargin = 35;
		//this.width = 60;
		//this.spacing = 30;
		//this.offset = Math.round(this.spacing / 2);
		
		this.vmargin = 40;
		this.height = Math.round(this.width * 8 / 5);
		this.vspacing = 25;

        this.bottompart = this.vmargin + (10 * this.vspacing) + this.height;
	}
	
	findRow(xInput) {
		return Math.floor((xInput - this.lmargin) / (this.width + this.spacing));
	}
	findDrawX(row) {
		return (row * (this.width + this.spacing)) + this.lmargin + this.offset;
	}
	findCol(rowlength, yInput) {
		if (rowlength < 10) {
			let col = Math.floor((yInput - this.vmargin) / this.vspacing);
			if (col > rowlength - 1 && yInput < this.vmargin + (rowlength*this.vspacing) + this.height) {
                // Card at bottom of row
				return rowlength - 1;
			}
			else if (col < rowlength) {
				return col;
			}
		}
		else {
			let col = Math.floor((yInput - this.vmargin) / (this.vspacing * (10 / rowlength)));
			if (col > rowlength - 1 && yInput < this.vmargin + (this.vspacing * 10) + this.height) {
                // Card at bottom of row
				return rowlength - 1;
			}
			else if (col < rowlength) {
				return col;
			}
		}

		if (yInput >this.bottompart)
			return rowlength;
	}
	findDrawY(rowlength, y) {
		if (rowlength < 10)
			return this.vmargin + this.vspacing * y;
		else
			return this.vmargin + y * (this.vspacing * (10 / rowlength));
	}
}


function drawBoard(draw2d, exception=undefined) {

    draw2d.clearRect(0,0, 800,500);
		
	// Undo button
	//draw2d.fillStyle = "darkgreen";
	//draw2d.beginPath();
	//draw2d.arc(400,fmat.vmargin+(fmat.height/2), 20, 0,2*Math.PI, true);
	//draw2d.fill();
		
	// Main Area
	for (let i = 0; i < Game.table.length; i++) {

        let drawend = Game.table[i].length;
        if (exception !== undefined) {
			if (exception[0] === i)
	            drawend = exception[1]; // card to except when a single card position is passed
			else if (exception[0].length > 1) {
				for (let j = 0; j < exception.length; j++) {
					if (exception[j][0] === i)
						drawend = exception[j][1];
					// cards to except when a list of position lists is passed
				}
			}
		}

        if (drawend === 0) {
            draw2d.fillStyle = "darkgreen";
            draw2d.fillRect(Game.Board.findDrawX(i), Game.Board.vmargin, Game.Board.width, Game.Board.height);
        }

        for (let j = 0; j < drawend; j++)
            drawCard(Game.Board.findDrawX(i), Game.Board.findDrawY(Game.table[i].length,j), Game.table[i][j]);
        
	}
		
	// Win Decks
    for (let i = 0; i < 8/*Game.winDeck.length*/; i++) {
        if (i > Game.winDeck.length - 1) {
            draw2d.fillStyle = "darkgreen";
            draw2d.fillRect(Game.Board.findDrawX(i), Game.Board.bottompart, Game.Board.width, Game.Board.height);
        }
        else {
            let tempking = new Card(12, Game.winDeck[i]);
            drawCard(Game.Board.findDrawX(i), Game.Board.bottompart, tempking);
        }
    }

	// Undo Button
	/*
	let buttonx = Game.Board.findDrawX(Game.table.length-2) + (Game.Board.width / 2);
	let buttony = Game.Board.bottompart + (Game.Board.height / 2);
	draw2d.fillStyle = "darkgreen";
	draw2d.moveTo(buttonx, buttony);
	draw2d.arc(buttonx, buttony, Game.Board.width/2, 0,2*Math.PI, true);
	draw2d.fill();
	*/

	// Draw Pile
	if (Game.deck.length > 0) {
		//let tempcard = Game.deck[Game.deck.length-1];
		//tempcard.flip();
		let tempcard = new Card(0,"",false);
		drawCard(Game.Board.findDrawX(Game.table.length-1), Game.Board.bottompart, tempcard);
		draw2d.fillStyle = "blue";
		draw2d.fillText(Game.deck.length / 10,
						Game.Board.findDrawX(Game.table.length-1) + Game.Board.width/2 - 4,
						Game.Board.bottompart + Game.Board.height/2 + 4);
	}
	else {
		draw2d.fillStyle = "darkgreen";
        draw2d.fillRect(Game.Board.findDrawX(Game.table.length-1), Game.Board.bottompart, Game.Board.width, Game.Board.height);
	}

}
