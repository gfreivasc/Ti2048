var windowWidth = Titanium.Platform.displayCaps.platformWidth;
var windowHeight = Titanium.Platform.displayCaps.platformHeight;

var gameOverDialog = Ti.UI.createAlertDialog({
	cancel: 1,
	buttonNames: ['Top 10', 'Try again!'],
	message: 'Would you like to try again?',
	title: 'Game over!'
});

gameOverDialog.addEventListener('click', function(e) {
	if (e.index === e.source.cancel) return;
	
	scoreRank.sort(function(a, b) { return b.score - a.score; });
	for (var i = 0; i < scoreRank.length; ++i) scoreRank[i].rank = i + 1;
	var rankWindow = Alloy.createController('ranking').getView();
	rankWindow.open();
});

var gameWinDialog = Ti.UI.createAlertDialog({
	cancel: 1,
	buttonNames: ['Restart', 'Keep going!'],
	message: 'You have reached the 2048!',
	title: 'You did it!'
});

gameWinDialog.addEventListener('click', function (e) {
	if (e.index === e.source.cancel) return;
	updateRank(gamePoints);
	initGame();
});

function leftUpSwipe(row) {
	var nRow = [];
	for (var i = 0; i < 4; ++i) {
		if (row[i] !== 0) nRow.push(row[i]);
	}
	Titanium.API.log("in: " + row.toString());
	row = nRow;
	nRow = [];
	for (var i = 0; i < row.length; ++i) {
		if (i != (row.length - 1) && row[i] === row[i + 1]) {
			nRow.push(row[i]*2);
			i++;
			Titanium.API.log("Colision! Generated "+(row[i]*2).toString());
			gamePoints += row[i]*2;
			tilesInGame--;
			if (row[i]*2 === 2048) {
				gameWinDialog.show();
			}
		}
		else {
			nRow.push(row[i]);
		}
	}
	
	var blankSpace = 4 - nRow.length;
	for (var i = 0; i < blankSpace; ++i) {
		nRow.push(0);
	}
	Titanium.API.log("out:"+nRow.toString());
	return nRow;
}

function rightDownSwipe(row) {
	var nRow = [];
	for (var i = 0; i < 4; ++i) {
		if (row[i] !== 0) nRow.push(row[i]);
	}
	Titanium.API.log(row);
	row = nRow;
	nRow = [];
	for (var i = 0; i < 4 - row.length; ++i) {
		nRow.push(0);
	}
	var buf = [];
	for (var i = row.length - 1; i >= 0; --i) {
		if (i !== 0 && row[i] === row[i - 1]) {
			buf.push(row[i]*2);
			nRow.unshift(0);
			i--;
			gamePoints += row[i]*2;
			Titanium.API.log("Colision! Generated "+(row[i]*2).toString());
			tilesInGame--;
			if (row[i]*2 === 2048) {
				gameWinDialog.show();
			}
		}
		else {
			buf.push(row[i]);
		}
	}
	
	buf = buf.reverse();
	for (var i = 0; i < buf.length; ++i) {
		nRow.push(buf[i]);
	}
	
	Titanium.API.log(nRow.toString());
	return nRow;
}

function checkGamePlayable() {
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			if (i && gameState[i][j] === gameState[i - 1][j]) return true;
			if (j && gameState[i][j] === gameState[i][j - 1]) return true;
		}
	}

	return false;
}

function newTile() {
	var c = (Math.random() > 0.9) ? 4 : 2;
	var put = false;
	
	while (!put) {
		var k = Math.floor(Math.random()*16);
		var i = Math.floor(k / 4);
		var j = k % 4;
		
		if (!gameState[i][j]) {
			gameState[i][j] = c;
			put = true;
			gamePoints += c;
			tilesInGame++;
		} 
	}
	
	if (tilesInGame === 16 && !checkGamePlayable()) {
		gameOverDialog.show();
		updateRank(gamePoints);
		initGame();
	}
}

function swiper(e) {
	var dir = e.direction;
	var moved = false;
	Titanium.API.log(dir);
	
	gameOverDialog.show();
	
	if (dir === "up") {
		var col = [];
		for (var i = 0; i < 4; ++i) {
			for (var j = 0; j < 4; ++j) {
				col.push(gameState[j][i]);
			}
			col = leftUpSwipe(col);
			for (var j = 0; j < 4; ++j) {
				if (gameState[j][i] !== col[j]) {
					gameState[j][i] = col[j];
					moved = true;
				}
			}
			while (col.length > 0) col.pop();
		}
	}
	if (dir === "left") {
		for (var i = 0; i < 4; ++i) {
			var row = leftUpSwipe(gameState[i]);
			for (var j = 0; j < 4; ++j) {
				if (gameState[i][j] !== row[j]) {
					gameState[i][j] = row[j];
					moved = true;
				}
			}
		}
	}
	if (dir === "down") {
		var col = [];
		for (var i = 0; i < 4; ++i) {
			for (var j = 0; j < 4; ++j) {
				col.push(gameState[j][i]);
			}
			col = rightDownSwipe(col);
			for (var j = 0; j < 4; ++j) {
				if (gameState[j][i] !== col[j]) {
					gameState[j][i] = col[j];
					moved = true;
				}
			}
			while (col.length > 0) col.pop();
		}
	}
	if (dir === "right") {
		for (var i = 0; i < 4; ++i) {
			var row = rightDownSwipe(gameState[i]);
			for (var j = 0; j < 4; ++j) {
				if (gameState[i][j] !== row[j]) {
					gameState[i][j] = row[j];
					moved = true;
				}
			}
		}
	}
	
	if(moved) newTile();
	updateView();
}

var gameSquaresT = [];
var gameLabelsT = [];

for (var i = 0; i < 4; ++i) {
	gameSquaresT[i] = [];
	gameLabelsT[i] = [];
}

for (var i = 0; i < 4; i++) {
	for (var j = 0; j < 4; ++j) {
		gameSquaresT[i][j] = Titanium.UI.createView({
			id:"sq"+i.toString()+j.toString(),
			height:70,	
			width:70,
			left:8+78*j,
			top:8+78*i,
			backgroundColor:"#777",
			borderRadius:3
		});
		$.gameTable.add(gameSquaresT[i][j]);
	}
}

for (var i = 0; i < 4; ++i) {
	for (var j = 0; j < 4; ++j) {
		gameLabelsT[i][j] = Titanium.UI.createLabel({
			id:"lb"+i.toString()+j.toString(),
			font: { fontSize: 26 },
			height: 60,
			width: 60,
			color: "#fff",
			textAlign: "center",
			shadowColor: "#aaa",
			shadowRadius: 2,
			text: ""
		});
		
		gameSquaresT[i][j].add(gameLabelsT[i][j]);
	}
}

var scoreLabel = Titanium.UI.createLabel({
	id: "scoreLabel",
	top: 10,
	left: 20,
	textAlign: "left",
	font: { fontSize: 38 },
	text: "Score: 0",
	color: "#888",
	shadowColor: "#777",
	shadowRadius: 3
});

$.index.add(scoreLabel);

function updateView() {
	scoreLabel.text = "Score: "+gamePoints.toString();
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			gameLabelsT[i][j].text = gameState[i][j] !== 0 ? gameState[i][j].toString() : "";
			var n = Math.floor(7 + Math.log(gameState[i][j]+1)/Math.log(2));
			n = Math.min(n, 16).toString(16).slice(-1);
			gameSquaresT[i][j].backgroundColor = "#"+n+n+"7";
		}
	}
}

initRank();
initGame();
updateView();

$.index.open();
