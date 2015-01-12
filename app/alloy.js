// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var db = Ti.Database.install('../scores.sqlite', 'scores.selite');
db.execute('CREATE TABLE IF NOT EXISTS scores (data DATE, score INT)');
var scoreRank = [];

function initRank() {
	var rows = db.execute('SELECT * FROM scores');
	
	while (rows.isValidRow()) {
		scoreRank.push({rank: 0, score: rows.fieldByName('score'), date: rows.fieldByName('data')});
		rows.next();
	}
}

function updateRank(newScore) {
	var min = 0xffffff;
	var mIdx = 0;
	var d = (new Date()).toISOString();
	
	if (scoreRank.length < 10) {
		db.execute('INSERT INTO scores(data, score) VALUES ('+d+', '+newScore+')');
	}
	else {
		for (var i = 0; i < 10; ++i) {
			if (scoreRank[i].score < min) {
				min = scoreRank[i].score;
				mIdx = i;
			}
		}
		
		if (min < newScore) {
			var min = db.execute('SELECT MIN(score) FROM scores').fieldByName('score');
		
			scoreRank[mIdx].score = newScore;
			scoreRank[mIdx].date = d;
				
			db.execute('DELETE FROM scores WHERE score='+min);
			db.execute('INSERT INTO scores(score) VALUES ('+newScore+')');
		}
	}
}

var gameState = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

var gamePoints = 0;
var tilesInGame = 0;

function initGame() {
	var k = Math.floor(Math.random()*16);
	var c = (Math.random() > 0.9) ? 4 : 2;
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			if (i*4 + j == k) gameState[i][j] = c;
			else gameState[i][j] = 0;
		}
	}
	gamePoints = c;
	tilesInGame = 1;
}