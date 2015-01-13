$.ranking.title = 'Top 10';

var rows = [];

for (var i = 0; i < scoreRank.length && i < 10; ++i) {
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
		var d = scoreRank[i].date;
		
		var dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var strDate = dayArr[d.getDay()]+' '+d.getDate()+'/'+(d.getMonth() + 1);
		strDate += '/'+d.getFullYear()+' '+d.toLocaleTimeString();
		
		Ti.API.log(strDate);
		
		var date = Ti.UI.createLabel({
			text: strDate,
			font: { fontSize: 20 },
			width: Ti.UI.FILL,
			textAlign: "right",
			color:'#aaa'
		});
		
		temp.add(date);
	}
	
	rows.push(temp);
}

$.ranking.add(Ti.UI.createTableView({
	data: rows,
	font: { fontSize: 18, color:'#777'}
}));


