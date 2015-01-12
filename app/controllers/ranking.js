$.ranking.title = 'Top 10';

var rows = [];

for (var i = 0; i < 10; ++i) {
	var temp = Ti.UI.createTableViewRow({
		font: { fontSize: 24 },
		color:'#777'
	});
	
	var rank = Ti.UI.createLabel({
		text: scoreRank[i].rank+' - '+scoreRank[i].score,
		left: 10,
		font: { fontSize: 24 },
		color:'#777'
	});
	
	temp.add(rank);
	
	if (scoreRank[i].date) {
		var dt = new Date(scoreRank[i].date);
		var strDate = dt.toDateString(); //d+'/'+m+'/'+y;
		
		var date = Ti.UI.createLabel({
			text: strDate,
			font: { fontSize: 20 },
			width: Ti.UI.FILL,
			textAlign: "right",
			color:'#bbb'
		});
		
		temp.add(date);
	}
	
	rows.push(temp);
}

$.ranking.add(Ti.UI.createTableView({
	data: rows,
	font: { fontSize: 18, color:'#777'}
}));


