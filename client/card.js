var react = require("react");

var colorMap = {
	"club":"C",
	"diamond":"D",
	"spade":"S",
	"heart":"H"
};

var kindMap = {
	"2":"2",
	"3":"3",
	"4":"4",
	"5":"5",
	"6":"6",
	"7":"7",
	"8":"8",
	"9":"9",
	"10":"10",
	"jack":"J",
	"queen":"Q",
	"king":"K",
	"ace":"A"
}

module.exports = class Card extends react.Component{
	render(){
		return react.createElement("img",{src:"/public/cardsJS/cards/"+kindMap[this.props.kind]+colorMap[this.props.color]+".svg",className:"card"+(this.props.className?" "+this.props.className:""),onClick:this.props.onClick});
	}
}
