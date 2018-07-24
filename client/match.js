var react = require("react");
var Client = require("./client");
var {Card} = require("react-playing-cards");
var allCards = require("../server/cards");

var suitMap = {
	"club":"C",
	"diamond":"D",
	"heart":"H",
	"spade":"S"
};
var rankMap = {
	"2":"2",
	"3":"3",
	"4":"4",
	"5":"5",
	"6":"6",
	"7":"7",
	"8":"8",
	"9":"9",
	"10":"T",
	"jack":"J",
	"queen":"Q",
	"king":"K",
	"ace":"A"
}

module.exports = class Match extends react.Component{
	constructor(p){
		super(p);
		this.client = new Client(this.props.id);
		this.client.on("change",()=>this.forceUpdate());
		this.selectedCards = [];
	}
	render(){
		return react.createElement("div",{className:"game"},
			react.createElement("div",{className:"table"},new Array(this.client.players).fill(0).map((v,i)=>{
				return react.createElement("div",{className:"player"+(i==(this.client.currentRound&&(this.client.currentRound.startedBy+this.client.currentRound.cards.length)%this.client.players)?" active":"")},
					(()=>{
						var games = this.client.games||[];
						var matchPoints = this.client.calculatePoints(games.slice(0,games.length-1));
						var gamePoints = this.client.calculatePoints(games.slice(games.length-1));
						return react.createElement("h1",{},
							i==this.client.seat?"Ich":"Spieler "+(i+1),
							react.createElement("br"),
							matchPoints[i]+" ("+gamePoints[i]+")");
					})(),
					(()=>{
						var card = this.client.currentRound && this.client.currentRound.cards[(this.client.players+i-this.client.currentRound.startedBy)%this.client.players];
						if(!card) return null;
						return react.createElement("div",{class:"card"},
							react.createElement(Card,{suit:suitMap[card.color],rank:rankMap[card.kind]})
						)
					})()
				)
			})),
			this.client.connected?react.createElement("div",{className:"hand"},this.sortCards(this.client.cards).map(c=>
				react.createElement("div",{className:"card"+(this.selectedCards.includes(c)?" active":""),onClick:this.clickCard.bind(this,c)},
					react.createElement(Card,{suit:suitMap[c.color],rank:rankMap[c.kind]})
				)
			)):null,

			this.client.connected?null:"connecting..."
		)
	}

	sortCards(cards){
		return cards.slice().sort((a,b)=>{
			if(a.color == b.color){
				return allCards.kinds.indexOf(a.kind)-allCards.kinds.indexOf(b.kind);
			}else{
				return allCards.colors.indexOf(a.color)-allCards.colors.indexOf(b.color);
			}
		});
	}


	clickCard(card){
		if(this.client.stage == "passing"){
			var index = this.selectedCards.indexOf(card);
			if(index < 0){
				this.selectedCards.push(card);
			}else{
				this.selectedCards.splice(index,1);
			}
			this.forceUpdate();
			if(this.selectedCards.length == 3){
				this.client.passCards(this.selectedCards);
			}
		}else if(this.client.stage == "playing"){
			this.selectedCards = [];
			this.client.playCard(card);
		}
	}
}
