class Tile {
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
}

function generateAdjacent() {
	var x = [];
	var y = [];
	for (let i = 0; i < 2 * Math.PI; i += (Math.PI) / 4) {
		x.push(Math.round(Math.cos(i)));
		y.push(Math.round(Math.sin(i)));
	}
	return [x,y];
}

function drawTile(x,y, tile) {

	var canvas = document.getElementById("thing");
	if (canvas.getContext) {
		var draw2d = canvas.getContext("2d");
		
		if (tile.hidden) {
			draw2d.fillStyle = "black";
			draw2d.fillRect(x*35,y*35, 35,35);
			draw2d.fillStyle = "gray";
			draw2d.fillRect(x*35 + 1,y*35 + 1, 33,33);
			draw2d.fillStyle = "darkgray";
			draw2d.fillRect(x*35 + 5,y*35 + 5, 25,25);
			
			if (tile.marked) {
				draw2d.strokeStyle = "red";
				draw2d.beginPath();
				draw2d.moveTo(x*35 + 9,y*35 + 9);
				draw2d.lineTo(x*35 + 26,y*35 + 26);
				draw2d.stroke();
				
				draw2d.beginPath();
				draw2d.moveTo(x*35 + 26, y*35 + 9);
				draw2d.lineTo(x*35 + 9, y*35 + 26);
				draw2d.stroke();
			}
		}
		else {
			draw2d.fillStyle = "black";
			draw2d.fillRect(x*35,y*35, 35,35);
			draw2d.fillStyle = "lightgray";
			draw2d.fillRect(x*35 + 1,y*35 + 1, 33,33);
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
				draw2d.fillText(tile.num, x*35 + 12,y*35 + 24);
			}
			else if (tile.num == -1) {
				draw2d.fillStyle = "black";
				draw2d.beginPath();
				draw2d.arc(x*35 + 17,y*35 + 22, 10, 0,2*Math.PI, true);
				draw2d.fill();
				
				draw2d.fillRect(x*35 + 14,y*35 + 7, 7,15);
				
				draw2d.fillStyle = "white";
				draw2d.beginPath();
				draw2d.arc(x*35 + 21,y*35 + 18, 2, 0,2*Math.PI, true);
				draw2d.fill();
				
				draw2d.beginPath();
				draw2d.moveTo(x*35 + 17,y*35 + 12);
				draw2d.lineTo(x*35 + 21,y*35 + 12);
				draw2d.lineTo(x*35 + 24,y*35 + 15);
				draw2d.fill();
			}
		}
	}
}

function gameLoopSqu(brd, mns) {
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
					console.log("flipping " + tilex + "," + tiley + " and its neighbors");
					gameBoard[tilex][tiley].flip();
					drawTile(tilex,tiley, gameBoard[tilex][tiley]);
					
					numflipped++;
					console.log("number of tiles remaining: " + (gameBoard.length * gameBoard[0].length - numflipped));
					
					let adjacent = generateAdjacent();
					for (let i = 0; i < adjacent[0].length; i++)
						revealField(tilex + adjacent[0][i],tiley + adjacent[1][i]);
				}
				else {
					console.log("flipping " + tilex + "," + tiley + " and its neighbors - base case");
					gameBoard[tilex][tiley].flip();
					drawTile(tilex,tiley, gameBoard[tilex][tiley]);
					
					numflipped++;
					console.log("number of tiles remaining: " + (gameBoard.length * gameBoard[0].length - numflipped));
				}
			}
		}}
	}
	
	// On Click
	canvas.addEventListener("click", (e) => {
		
		if (!lost) {
			
			// Get the click position
			var canvasClick = [e.offsetX,e.offsetY];
			//console.log("raw click: " + canvasClick[0] + "," + canvasClick[1]);
			
			var tileSel = [Math.floor((canvasClick[0]) / 35), Math.floor((canvasClick[1]) / 35)];
			//console.log("click input: " + tileSel[0] + "," + tileSel[1]);
			
			if (!gameBoard[tileSel[0]][tileSel[1]].marked) {
				if (gameBoard[tileSel[0]][tileSel[1]].num == -1) {
					console.log("You've trodden upon a mine!");
					
					document.getElementById("warning_squ").innerHTML = "You Lost!";
					
					for (let i = 0; i < gameBoard.length; i++) {
						for (let j = 0; j < gameBoard[i].length; j++) {
							if (gameBoard[i][j].num == -1) {
								gameBoard[i][j].flip();
								drawTile(i,j, gameBoard[i][j]);
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
						drawTile(tileSel[0],tileSel[1], gameBoard[tileSel[0]][tileSel[1]]);
						
						numflipped++;
						console.log("number of tiles remaining: " + (gameBoard.length * gameBoard[0].length - numflipped));
					}
				}
			}
			else
				console.log("Don't click it if you think it's a mine!");
			
			if (numflipped == (gameBoard.length * gameBoard[0].length) - numMines) {
				document.getElementById("warning_squ").innerHTML = "You Won!";
				document.getElementById("warning_squ").style.color = "green";
				
				lost = true;
			}
		
		}
	});
	
	// On Right Click
	canvas.addEventListener("contextmenu", (e) => {
		
		if (!lost) {
			
			e.preventDefault();
			var canvasClick = [e.offsetX,e.offsetY];
			
			var tileSel = [Math.floor((canvasClick[0]) / 35), Math.floor((canvasClick[1]) / 35)];
			console.log("marking: " + tileSel[0] + "," + tileSel[1]);
			
			if (gameBoard[tileSel[0]][tileSel[1]].marked)
				numflagged--;
			else
				numflagged++;
			document.getElementById("mines_remaining_squ").innerHTML = (numMines - numflagged) + " remaining";
			
			gameBoard[tileSel[0]][tileSel[1]].toggleMark();
			drawTile(tileSel[0],tileSel[1], gameBoard[tileSel[0]][tileSel[1]]);
		}
	});
	
	
	
}

function newSquareGame() {
	
	/*
	let oldgame = document.getElementById("thing");
	oldgame.remove();
	let newgame = document.createElement("canvas");
	newgame.setAttribute("id","thing");
	newgame.setAttribute("width","300px");
	newgame.setAttribute("height","300px");
	newgame.innerHTML = "Minesweeper";
	document.getElementById("canvas_holder").appendChild(newgame);
	*/
	
	var boardheight = parseInt(document.getElementById("heightIn").value);
	var boardwidth = parseInt(document.getElementById("widthIn").value);
	var minecount = parseInt(document.getElementById("minesIn").value);
	
	document.getElementById("warning_squ").innerHTML = "";
	
	if (minecount > boardwidth * boardheight) {
		document.getElementById("warning_squ").innerHTML = "That many mines won't fit in a grid that size";
	}
	else {
	
		document.getElementById("thing").width = boardwidth * 35;
		document.getElementById("thing").height = boardheight * 35;
		
		document.getElementById("mines_remaining_squ").innerHTML = minecount + " remaining";
			
		var board = [];
		
		for (let i = 0; i < boardwidth; i++) {
			board.push([])
			for (let j = 0; j < boardheight; j++) {
				let tile = new Tile(true, 0, false);
				board[i].push(tile);
			}
		}
	
		// Lay the mines
		// Set the numbers
		let mines = minecount;
		let i = 0;
		let j = 0;
		while (mines > 0) {
			
			let prob = (boardheight * boardwidth) / mines;
			let mineroll = Math.floor(Math.random() * prob);
			//console.log("checking " + i + "," + j);
			if (mineroll == 1 && board[i][j].num > -1) {
				
				console.log("laying mine at " + i + "," + j);
				
				board[i][j].num = -1;
				mines--;
				
				let adjacentx = [];
				let adjacenty = [];
				for (let angle = 0; angle < 2 * Math.PI; angle += (Math.PI) / 4) {
					adjacentx.push(Math.round(Math.sin(angle)));
					adjacenty.push(Math.round(Math.cos(angle)));
				}
				for (let k = 0; k < 8; k++) {
					if (board[i + adjacentx[k]] != undefined) {
						if (board[i + adjacentx[k]][j + adjacenty[k]] != undefined) {
							if (board[i + adjacentx[k]][j + adjacenty[k]].num > -1)
								board[i + adjacentx[k]][j + adjacenty[k]].num++;
						}
					}
				}
			}
			
			if (j >= boardheight - 1) {
				i++;
				j = 0;
			}
			else if (i >= boardwidth - 1) {
				i = 0;
				j = 0;
			}
			else
				j++;
		}
		delete(mines);
		delete(i);
		delete(j);
		
		// Render the board
		for (let i = 0; i < boardwidth; i++) {
			for (let j = 0; j < boardheight; j++) {
				drawTile(i,j, board[i][j]);
			}
		}
		
		gameLoopSqu(board, minecount);
	}
	
}