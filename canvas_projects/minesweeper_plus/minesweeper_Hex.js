/*class Tile {
	constructor(hidden, num, marked) {
		this.hidden = hidden;
		this.num = num;
		this.marked = marked;
	}
	
	flip() {
		this.hidden = !this.hidden;
	}
	
	toggleMark() {
		this.marked = !this.marked;
	}
}*/

function generateAdjacent(row, radius) {
	if (row < radius - 1)
		return [[0,1,0,-1,1,-1],[1,0,-1,0,1,-1]];
	else if (row == radius - 1)
		return [[0,1,0,-1,-1,1],[1,0,-1,0,-1,-1]];
	else
		return [[0,1,0,-1,1,-1],[1,0,-1,0,-1,1]];
}

function drawHex(x,y, tile, rad) {
	
	/*
	    |\
	    | \
	 y  |30\
	 d  |   \------scale
	 i--|    \
	 f  |     \
	 f  |   60 \
	    |_______\
	        |
	      xdiff
	*/
	
	const scale = 30;
	const xdiff = scale / 2;// Math.round(scale / 2);
	const ydiff = xdiff * Math.sqrt(3);//Math.round(xdiff * Math.sqrt(3));
	
	const X_0 = scale;
	const Y_0 = rad * ydiff;
	
	var drawx;
	var drawy;
	if (x < rad) {
		drawx = X_0 + (y * (3) * xdiff);
		drawy = Y_0 + (x * (Math.sqrt(3)) * scale) - (y * ydiff);
	}
	else {
		drawx = X_0 + ((y - (rad - x - 1)) * (3) * xdiff);
		drawy = Y_0 + (x * (Math.sqrt(3)) * scale) - ((y - (rad - x - 1)) * ydiff);
	}
	
	//console.log("Drawing " + x + "," + y + " at " + drawx + "," + drawy);
	
	var canvas = document.getElementById("thing");
	if (canvas.getContext) {
		var draw2d = canvas.getContext("2d");
		
		
		function hexagon(border_size) {
			let border_mult = 1 - (border_size / scale);
			draw2d.beginPath();
			draw2d.moveTo(Math.round(drawx+(border_mult*xdiff)),Math.round(drawy-(border_mult*ydiff)));
			draw2d.lineTo(Math.round(drawx+(border_mult*scale)),Math.round(drawy+(border_mult)));
			draw2d.lineTo(Math.round(drawx+(border_mult*xdiff)),Math.round(drawy+(border_mult*ydiff)));
			draw2d.lineTo(Math.round(drawx-(border_mult*xdiff)),Math.round(drawy+(border_mult*ydiff)));
			draw2d.lineTo(Math.round(drawx-(border_mult*scale)),Math.round(drawy+(border_mult)));
			draw2d.lineTo(Math.round(drawx-(border_mult*xdiff)),Math.round(drawy-(border_mult*ydiff)));
			draw2d.fill();
		}
		
		if (tile.hidden) {
			draw2d.fillStyle = "black";
			hexagon(0);
			
			draw2d.fillStyle = "gray";
			hexagon(1);
			
			draw2d.fillStyle = "darkgray";
			hexagon(7);
			
			if (tile.marked) {
				
				draw2d.strokeStyle = "red";
				draw2d.beginPath();
				draw2d.moveTo(drawx - (ydiff / 2),drawy - (xdiff / 2));
				draw2d.lineTo(drawx + (ydiff / 2),drawy + (xdiff / 2));
				draw2d.stroke();
				
				draw2d.beginPath();
				draw2d.moveTo(drawx - (ydiff / 2), drawy + (xdiff / 2));
				draw2d.lineTo(drawx + (ydiff / 2), drawy - (xdiff / 2));
				draw2d.stroke();
			}
		}
		else {
			draw2d.fillStyle = "black";
			hexagon(0);
			
			draw2d.fillStyle = "lightgray";
			hexagon(1);
			
			if (tile.num > 0) {
				let textcolor;
				switch (tile.num) {
					case 1: textcolor = "blue"; break;
					case 2: textcolor = "green"; break;
					case 3: textcolor = "red"; break;
					case 4: textcolor = "purple"; break;
					case 5: textcolor = "orange"; break;
					case 6: textcolor = "skyblue"; break;
					case 7: textcolor = "yellow"; break;
					case 8: textcolor = "black"; break;
				}
				draw2d.fillStyle = textcolor;
				draw2d.font = "20px sans-serif";
				draw2d.fillText(tile.num, drawx, drawy);
			}
			else if (tile.num == -1) {
				draw2d.fillStyle = "black";
				draw2d.beginPath();
				draw2d.arc(drawx, drawy, 10, 0,2*Math.PI, true);
				//draw2d.arc(x*35 + 17,y*35 + 22, 10, 0,2*Math.PI, true);
				draw2d.fill();
				
				draw2d.fillRect(drawx - 3, drawy - 15, 7, 15);
				//draw2d.fillRect(x*35 + 14,y*35 + 7, 7,15);
				
				draw2d.fillStyle = "white";
				draw2d.beginPath();
				draw2d.arc(drawx + 4, drawy - 4, 2, 0,2*Math.PI, true);
				//draw2d.arc(x*35 + 21,y*35 + 18, 2, 0,2*Math.PI, true);
				draw2d.fill();
				
				draw2d.beginPath();
				draw2d.moveTo(drawx, drawy - 10);
				//draw2d.moveTo(x*35 + 17,y*35 + 12);
				draw2d.lineTo(drawx + 4, drawy - 10);
				//draw2d.lineTo(x*35 + 21,y*35 + 12);
				draw2d.lineTo(drawx + 7, drawy - 7);
				//draw2d.lineTo(x*35 + 24,y*35 + 15);
				draw2d.fill();
			}
			
		}
		/*draw2d.fillStyle = "green";
		draw2d.beginPath();
		draw2d.arc(X_0,Y_0, 2, 0,2*Math.PI, true);
		draw2d.fill();
		draw2d.strokeStyle = "green";
		draw2d.beginPath();
		draw2d.arc(drawx,drawy, scale, 0,2*Math.PI, true);
		draw2d.stroke();*/
	}
}

function gameLoopHex(brd, mns) {
	var canvas = document.getElementById("thing");
	
	var numflagged = 0;
	var numflipped = 0;
	
	var gameBoard = brd;
	var numMines = mns;
	
	var lost = false;
	
	// Recursively flip all adjacent exposed tiles
	function revealField(tilex,tiley) {
		if (gameBoard[tilex] != undefined) { if (gameBoard[tilex][tiley] != undefined) {
			if (gameBoard[tilex][tiley].hidden && !gameBoard[tilex][tiley].marked) {
				if (gameBoard[tilex][tiley].num == 0) {
					//console.log("flipping " + tilex + "," + tiley + " and its neighbors");
					gameBoard[tilex][tiley].flip();
					drawHex(tilex,tiley, gameBoard[tilex][tiley], gameBoard[0].length);
					
					numflipped++;
					console.log("number of tiles remaining: " + ((gameBoard.length ** 2 - (gameBoard[0].length ** 2 + gameBoard[0].length)) - numflipped));
					
					let adjacent = generateAdjacent(brd[0].length, tiley);
					for (let i = 0; i < adjacent[0].length; i++)
						revealField(tilex + adjacent[0][i],tiley + adjacent[1][i]);
				}
				else {
					//console.log("flipping " + tilex + "," + tiley + " and its neighbors - base case");
					if (gameBoard[tilex][tiley].num > 0) {
						//console.log("encountered a mine from revealField()");
						gameBoard[tilex][tiley].flip();
						drawHex(tilex,tiley, gameBoard[tilex][tiley], gameBoard[0].length);
					
						numflipped++;
						//console.log("number of tiles remaining: " + (gameBoard.length * gameBoard[0].length - numflipped));
					}
				}
			}
		}}
	}
	
	function input2tile(click) {
		
		const scale = 30;
		const xdiff = scale / 2;
		const ydiff = xdiff * Math.sqrt(3);
		
		const X_0 = scale;
		const Y_0 = gameBoard[0].length * ydiff;
		
		let x;
		let y;
		let closest = [500, 500, 1000];
		
		// Go through every single point and find the closest one
		for (let i = 0; i < gameBoard[0].length; i++) {
			for (let j = 0; j < gameBoard[i].length; j++) {
				x = X_0 + (j * (3) * xdiff);
				y = Y_0 + (i * (Math.sqrt(3)) * scale) - (j * ydiff);
				
				let dist = Math.sqrt( (click[0] - x) ** 2 + (click[1] - y) ** 2 );
				if (dist < scale && dist < closest[2]) {
					closest[0] = i;
					closest[1] = j;
					closest[2] = dist;
					//console.log("closest point: " + i + "," + j + " with dist " + dist);
				}
			}
		}
		for (let i = 0; i < 2 * gameBoard[0].length - 1; i++) {
			for (let j = 0; j < gameBoard[i].length; j++) {
				x = X_0 + ((j - (gameBoard[0].length - i - 1)) * (3) * xdiff);
				y = Y_0 + (i * (Math.sqrt(3)) * scale) - ((j - (gameBoard[0].length - i - 1)) * ydiff);
				
				let dist = Math.sqrt( (click[0] - x) ** 2 + (click[1] - y) ** 2 );
				if (dist < scale && dist < closest[2]) {
					closest[0] = i;
					closest[1] = j;
					closest[2] = dist;
					//console.log("closest point: " + i + "," + j + " with dist " + dist);
				}
			}
		}
		/*
		if (x < rad) {
			drawx = X_0 + (y * (3) * xdiff);
			drawy = Y_0 + (x * (Math.sqrt(3)) * scale) - (y * ydiff);
		}
		else {
			drawx = X_0 + ((y - (rad - x - 1)) * (3) * xdiff);
			drawy = Y_0 + (x * (Math.sqrt(3)) * scale) - ((y - (rad - x - 1)) * ydiff);
		}
		*/
		
		return [closest[0],closest[1]];
	}
	
	// On Click
	canvas.addEventListener("click", (e) => {
		
		if (!lost) {
			
			// Get the click position
			var canvasClick = [e.offsetX,e.offsetY];
			//console.log("raw click: " + canvasClick[0] + "," + canvasClick[1]);
			
			//var tileSel = [Math.floor((canvasClick[0]) / 35), Math.floor((canvasClick[1]) / 35)];
			//console.log("click input: " + tileSel[0] + "," + tileSel[1]);
			var tileSel = input2tile(canvasClick);
			
			
			console.log("click input: " + tileSel[0] + "," + tileSel[1]);
			
			if (!gameBoard[tileSel[0]][tileSel[1]].marked) {
				if (gameBoard[tileSel[0]][tileSel[1]].num == -1) {
					console.log("You've trodden upon a mine!");
					
					document.getElementById("warning_hex").innerHTML = "You Lost!";
					
					for (let i = 0; i < gameBoard.length; i++) {
						for (let j = 0; j < gameBoard[i].length; j++) {
							if (gameBoard[i][j].num == -1) {
								gameBoard[i][j].flip();
								drawHex(i,j, gameBoard[i][j], gameBoard[0].length);
							}
						}
					}
					
					lost = true;
				}
				else if (gameBoard[tileSel[0]][tileSel[1]].num == 0) {
					console.log("revealing field");
					revealField(tileSel[0],tileSel[1]);
				}
				else {
					console.log("revealing number");
					if (gameBoard[tileSel[0]][tileSel[1]].hidden) {
						gameBoard[tileSel[0]][tileSel[1]].flip();
						drawHex(tileSel[0],tileSel[1], gameBoard[tileSel[0]][tileSel[1]], gameBoard[0].length);
						
						numflipped++;
						console.log("number of tiles remaining: " + (gameBoard.length * gameBoard[0].length - numflipped));
					}
				}
			}
			else
				console.log("Don't click it if you think it's a mine!");
			
			if (numflipped == (gameBoard.length * gameBoard[0].length) - numMines) {
				document.getElementById("warning_hex").innerHTML = "You Won!";
				document.getElementById("warning_hex").style.color = "green";
				
				lost = true;
			}
		
		}
	});
	
	// On Right Click
	canvas.addEventListener("contextmenu", (e) => {
		
		if (!lost) {
			
			e.preventDefault();
			var canvasClick = [e.offsetX,e.offsetY];
			
			var tileSel = input2tile(canvasClick);
			console.log("marking: " + tileSel[0] + "," + tileSel[1]);
			
			if (gameBoard[tileSel[0]][tileSel[1]].marked)
				numflagged--;
			else
				numflagged++;
			document.getElementById("mines_remaining_hex").innerHTML = (numMines - numflagged) + " remaining";
			
			gameBoard[tileSel[0]][tileSel[1]].toggleMark();
			drawHex(tileSel[0],tileSel[1], gameBoard[tileSel[0]][tileSel[1]], gameBoard[0].length);
		}
	});
	
	
	
}

function newHexGame() {
	
	const scale = 30;
	
	var boardrad = parseInt(document.getElementById("dim1").value);
	var minecount = parseInt(document.getElementById("hexmines").value);
	
	document.getElementById("warning_hex").innerHTML = "";
	
	if (minecount > boardrad ** 2) {
		document.getElementById("warning_hex").innerHTML = "That many mines won't fit in a grid that size";
	}
	else {
	
		//document.getElementById("thing").width = Math.round((1.5 * scale) * (2 * boardrad - 1));
		document.getElementById("thing").height = Math.round((Math.sqrt(3) * scale) * (2 * boardrad - 1));
		document.getElementById("thing").width = document.getElementById("thing").height;
		//document.getElementById("thing").width = boardrad * scale * 2 * (boardrad * 2);
		//document.getElementById("thing").height = boardrad * scale * 2 * (2 * boardrad - 1);
		
		document.getElementById("mines_remaining_hex").innerHTML = minecount + " remaining";
			
		var board = [];
		
		for (let i = 0; i < boardrad; i++) {
			board.push([]);
			for (let j = 0; j < boardrad + i; j++) {
				let tile = new Tile(true, 0, false);
				board[i].push(tile);
			}
		}
		for (let i = 1; i < boardrad; i++) {
			board.push([]);
			for (let j = 0; j < 2 * boardrad - i - 1; j++) {
				let tile = new Tile(true, 0, false);
				board[boardrad + i - 1].push(tile);
			}
		}
	
		// Lay the mines
		// Set the numbers
		let mines = minecount;
		let i = 0;
		let j = 0;
		while (mines > 0) {
			
			let prob = (board.length ** 2) - (boardrad ** 2 + boardrad) / mines;
			let mineroll = Math.floor(Math.random() * prob);
			//console.log("checking " + i + "," + j);
			if (mineroll == 1 && board[i][j].num > -1) {
				
				console.log("laying mine at " + i + "," + j);
				
				board[i][j].num = -1;
				mines--;
				
				let adjacent = generateAdjacent(i, board[0].length);
				for (let k = 0; k < adjacent[0].length; k++) {
					//console.log("Adjacent tiles to mine: " + (i + adjacent[0][k]) + "," + (j + adjacent[1][k]));
					if (board[i + adjacent[0][k]] != undefined) {
						if (board[i + adjacent[0][k]][j + adjacent[1][k]] != undefined) {
							if (board[i + adjacent[0][k]][j + adjacent[1][k]].num > -1) {
								board[i + adjacent[0][k]][j + adjacent[1][k]].num++;
							}
						}
					}
				}
			}
			if (j >= board[i].length - 1) {
				i++;
				j = 0;
			}
			else if (i >= board.length - 1) {
				i = 0;
				j = 0;
			}
			else
				j++
		}
		delete(mines);
		delete(i);
		delete(j);
		
		// Render the board
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board[i].length; j++) {
				drawHex(i,j, board[i][j], boardrad);
			}
		}
		
		gameLoopHex(board, minecount);
	}
	
}