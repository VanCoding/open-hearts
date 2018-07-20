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

module.exports = class Game extends react.Component{
	constructor(){
		super();
		this.client = new Client();
		this.client.on("change",()=>this.forceUpdate());
		this.selectedCards = [];
	}
	render(){
		return react.createElement("div",{className:"game"},
			react.createElement("div",{className:"table"},
				this.client.currentRound?react.createElement("div",{className:"field"},this.client.currentRound.cards.map((c,i)=>
					react.createElement("div",{className:"card "+["south","west","north","east"][(this.client.currentRound.startedBy+i+this.client.players-this.client.seat-1)%this.client.players]},
						react.createElement(Card,{suit:suitMap[c.color],rank:rankMap[c.kind]})
					)
				)):null
			),
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
				this.selectedCards = [];
			}
		}else if(this.client.stage == "playing"){
			this.client.playCard(card);
		}
	}
}
