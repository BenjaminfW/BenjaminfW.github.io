class Card {
	constructor(face, suit, faceUp=true) {
		this.face = face;
		this.suit = suit;
		this.faceUp = faceUp;
	}

	color() {
		if (this.suit == "h" || this.suit == "d")
			return "red";
		else
			return "black";
	}

    flip() {
        this.faceUp = !this.faceUp;
    }

	print() {
		var suitprint = "";
		if (this.suit == "s")
			suitprint = "spades";
		else if (this.suit == "c")
			suitprint = "clubs";
		else if (this.suit == "d")
			suitprint = "diamonds";
		else if (this.suit == "h")
			suitprint = "hearts";
		else
			suitprint = "no suit";
		
		let faceprint
		if (this.face == 0)
			faceprint = "A";
		else if (this.face == 10)
			faceprint = "J";
		else if (this.face == 11)
			faceprint = "Q";
		else if (this.face == 12)
			faceprint = "K";
		else
			faceprint = this.face + 1;
		
		return faceprint + " of " + suitprint;
	}
}


function fillRectCurved(draw2d, x, y, width, height, border_radius) {
	var rad = border_radius;

	draw2d.beginPath();
	draw2d.moveTo(x+rad,y);
	draw2d.arc(x+rad,y+rad, rad, Math.PI,3*Math.PI/2, false); //TL corner
	draw2d.lineTo(x+width-rad,y);
	draw2d.lineTo(x+width,y+rad);
	draw2d.arc(x+width-rad,y+rad, rad, 3*Math.PI/2,2*Math.PI, false); // TR corner
	draw2d.lineTo(x+width,y+height-rad);
	draw2d.lineTo(x+width-rad,y+height);
	draw2d.arc(x+width-rad,y+height-rad, rad, 0,Math.PI/2, false); //BR corner
	draw2d.lineTo(x+rad,y+height);
	draw2d.lineTo(x,y+height-rad);
	draw2d.arc(x+rad,y+height-rad, rad, Math.PI/2,Math.PI, false); // BL corner
	draw2d.lineTo(x,y+rad);
		
	draw2d.fill();

}

function drawSpade(draw2d, x,y) {
		
	// Two circles
	draw2d.beginPath();
	draw2d.arc(x-5,y, 8, 0,2*Math.PI, true);
	draw2d.moveTo(x+5,y)
	draw2d.arc(x+5,y, 8, 0,2*Math.PI, true);
		
	draw2d.fill();
		
	// Top part
	draw2d.beginPath();
	draw2d.moveTo(x-13,y)
	draw2d.bezierCurveTo(x-13,y-6, x-5,y-18, x,y-20);
	draw2d.bezierCurveTo(x+5,y-18, x+13,y-6, x+13,y);
		
	draw2d.fill();

    // Bottom part
	draw2d.beginPath();
	draw2d.moveTo(x-8,y+15);
	draw2d.bezierCurveTo(x,y+15, x-2,y+12, x,y);
	draw2d.bezierCurveTo(x+2,y+12, x,y+15, x+8,y+15);
		
	draw2d.fill();

}

function drawClub(draw2d, x,y) {
		
	// Circles
	draw2d.beginPath();
	draw2d.arc(x-8,y, 8, 0,2*Math.PI, true);
	draw2d.moveTo(x+8,y);
	draw2d.arc(x+8,y, 8, 0,2*Math.PI, true);
	draw2d.moveTo(x,y-13);
	draw2d.arc(x,y-10, 8, 0,2*Math.PI, true);
		
	draw2d.fill();
		
	draw2d.arc(x,y, 2, 0,2*Math.PI, true);
	draw2d.fill()
		
	// Bottom part
	draw2d.beginPath();
	draw2d.moveTo(x-8,y+15);
	draw2d.bezierCurveTo(x,y+15, x-2,y+12, x,y);
	draw2d.bezierCurveTo(x+2,y+12, x,y+15, x+8,y+15);
		
	draw2d.fill();

}

function drawDiamond(draw2d, x,y) {
		
	draw2d.fillStyle = "red";
		
	draw2d.beginPath();
	draw2d.lineTo(x-13,y);
	draw2d.lineTo(x,y-15);
	draw2d.lineTo(x+13,y);
	draw2d.lineTo(x,y+15);
		
	draw2d.fill();

}

function drawHeart(draw2d, x,y) {
		
	draw2d.fillStyle = "red";
		
	// Two circles
	draw2d.beginPath();
	draw2d.arc(x-6,y-6, 8, 0,2*Math.PI, true);
	draw2d.moveTo(x+5,y)
	draw2d.arc(x+6,y-6, 8, 0,2*Math.PI, true);
		
	draw2d.fill();
		
	// Top part
	draw2d.beginPath();
	draw2d.moveTo(x-14,y-6);
	draw2d.bezierCurveTo(x-15,y+5, x-2,y+8, x,y+15);
	draw2d.bezierCurveTo(x+2,y+8, x+15,y+5, x+14,y-6);
		
	draw2d.fill();

}

function drawCard(x, y, card) {
	const curve = 5;
	
	var canvas = document.getElementById("canvas");
	if (canvas.getContext) {
		var draw2d = canvas.getContext("2d");

		
		var cardWidth = Game.Board.width;
		var cardHeight = Game.Board.height;
		
		if (card.faceUp) {

			draw2d.fillStyle = "lightgray";
			fillRectCurved(draw2d, x-2,y-2, cardWidth+4,cardHeight+4, curve);
			draw2d.fillStyle = "white";
			fillRectCurved(draw2d, x,y, cardWidth,cardHeight, curve);

		
			if (card.color() === "red")
				draw2d.fillStyle = "red";
			else
				draw2d.fillStyle = "black";
		
			let text2draw;
			if (card.face == 0)
				text2draw = "A";
			else if (card.face == 10)
				text2draw = "J";
			else if (card.face == 11)
				text2draw = "Q";
			else if (card.face == 12)
				text2draw = "K";
			else
				text2draw = card.face + 1;
			draw2d.font = "15px sans-serif";
			draw2d.fillText(text2draw, x+(cardWidth/10),y+10+(cardWidth/10));
			//draw2d.fillText(card.suit, x+(cardWidth/10),y+10+Math.round((cardHeight/6)));
		
			if (card.suit == "s")
				drawSpade(draw2d, x+(cardWidth/2),y+(cardHeight/2));
			else if (card.suit == "c")
				drawClub(draw2d, x+(cardWidth/2),y+(cardHeight/2));
			else if (card.suit == "h")
				drawHeart(draw2d, x+(cardWidth/2),y+(cardHeight/2));
			else if (card.suit == "d")
				drawDiamond(draw2d, x+(cardWidth/2),y+(cardHeight/2));
			else
				draw2d.fillText(card.suit, x+(cardWidth/10),y+10+Math.round(cardHeight/6));

		}
		else {
			draw2d.fillStyle = "lightgray";
			fillRectCurved(draw2d, x-2,y-2, cardWidth+4,cardHeight+4, curve);
			draw2d.fillStyle = "white";
			fillRectCurved(draw2d, x,y, cardWidth,cardHeight, curve);
			draw2d.fillStyle = "skyblue";
			fillRectCurved(draw2d, x+7,y+7, cardWidth-14,cardHeight-14, curve);
		}
		
	}
}