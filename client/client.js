var EventEmitter = require("events").EventEmitter;
var allCards = require("../server/cards");

module.exports = class HeartsClient extends EventEmitter{
	constructor(id){
		super();
		this.connected = false;
		this.connection = new WebSocket((location.protocol=="https:"?"wss":"ws")+"://"+location.hostname+"/api/matches/"+id);
		this.connection.onmessage = msg=>{
			var data = JSON.parse(msg.data);
			switch(data.event){
				case "init":
					this.connected = true;
					this.seat = data.seat;
					this.stage = data.stage;
					this.players = data.players;
					this.cards = data.cards;
					this.games = data.games;
					this.currentGame = this.games[this.games.length-1];
					this.currentRound = this.currentGame.rounds[this.currentGame.rounds.length-1];
					this.emit("change");
					break;
				case "newGame":
					this.stage = "passing";
					this.cards = data.cards;
					this.games.push(this.currentGame = {
						rounds:[]
					})
					this.emit("change");
					break;
				case "exchangedCards":
					this.cards = data.cards;
					this.stage = "playing";
					this.currentGame.rounds.push(this.currentRound = {
						startedBy:data.startedBy,cards:[],wonBy:null
					});
					this.emit("change");
					break;
				case "playedCard":
					this.currentRound.cards.push(data.card);
					var index = this.cards.findIndex(c=>c.color==data.card.color&&c.kind==data.card.kind);
					if(index>=0){
						this.cards.splice(index,1);
					}
					if(this.currentRound.cards.length == this.players){
						var startColor = this.currentRound.cards[0].color;
						var highest = 0;
						for(var i = 1; i < this.currentRound.cards.length; i++){
							if(this.currentRound.cards[i].color == startColor && allCards.kinds.indexOf(this.currentRound.cards[i].kind) > allCards.kinds.indexOf(this.currentRound.cards[highest].kind)) highest = i;
						}

						this.currentRound.wonBy = (this.currentRound.startedBy+highest)%this.players;
						if(!this.cards.length){
							var playerPoints = this.calculatePoints(this.games);
							if(!playerPoints.filter(p=>p>=100).length){
								// game is still on
							}else{
								this.stage = "over";
							}
						}else{
							this.currentGame.rounds.push(this.currentRound = {
								startedBy:this.currentRound.wonBy,
								cards:[],
								wonBy:null
							});
						}
					}
					this.emit("change");
					break;
				case "error":
					alert(data.message);
					break;
			}
		}
		this.connection.onclose = ()=>{
			this.connected = false;
			this.emit("change");
		}
	}

	passCards(cards){
		this.connection.send(JSON.stringify({action:"passCards",cards}));
	}

	playCard(card){
		this.connection.send(JSON.stringify({action:"playCard",card}));
	}

	calculatePoints(games){
		var players = new Array(this.players).fill(0);
		return players.map((p,i)=>
			games.map(g=>{
				var playerPoints = players.map((p,i)=>
					g.rounds.filter(r=>r.wonBy==i).map(r=>
						r.cards.map(c=>c.color=="heart"?1:((c.color=="spade"&&c.kind=="queen")?13:0)).reduce((a,b)=>a+b,0)
					).reduce((a,b)=>a+b,0)
				);
				var victoryPlayer = playerPoints.indexOf(26);
				return victoryPlayer < 0?playerPoints[i]:(victoryPlayer==i?0:26);
			}).reduce((a,b)=>a+b,0)
		)
	}
}
