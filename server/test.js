var Match = require("./match.js");

var test = new Match();

while(test.stage != "over"){
	switch(test.stage){
		case "passing":
			for(var i = 0; i < test.players.length; i++){
				var player = test.players[i];
				test.passCards(i,player.cards.slice(0,3));
			}
			break;
		case "playing":
			for(var i = 0; i < test.players.length; i++){
				var player = (test.currentRound.startedBy+i)%test.players.length;

				var card = test.players[player].cards.filter(c=>c.color=="club"&&c.kind=="2")[0];
				if(!card && test.currentRound.cards.length){
					var startCard = test.currentRound.cards[0];
					card = test.players[player].cards.filter(c=>c.color==startCard.color)[0];
				}
				if(!card) card = test.players[player].cards.filter(c=>c.color!="heart")[0]
				if(!card) card = test.players[player].cards[0];

				console.log("playing card",card,"of cards",test.players[player].cards)

				test.playCard(player,card);
			}
			break;
	}
}

console.log("match over");
