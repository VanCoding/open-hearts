var EventEmitter = require("events").EventEmitter;

module.exports = class HeartsClient extends EventEmitter{
	constructor(){
		super();
		this.connected = false;
		this.connection = new WebSocket("ws://localhost/connect");
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
					this.games = [this.currentGame = {
						rounds:[this.currentRound = {
							startedBy:null,
							cards:[],
							wonBy:null
						}]
					}];
					this.emit("change");
					break;
				case "exchangedCards":
					this.cards = data.cards;
					this.stage = "playing";
					this.currentRound = {startedBy:null,cards:[],wonBy:null};
					this.currentGame.rounds.push(this.currentRound);
					this.emit("change");
					break;
				case "playedCard":
					this.currentRound.cards.push(data.card);
					var index = this.cards.findIndex(c=>c.color==data.card.color&&c.kind==data.card.kind);
					if(index>=0){
						this.cards.splice(index,1);
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
}
