var cards = [];
var colors = ["club","diamond","spade","heart"];
var kinds = ["2","3","4","5","6","7","8","9","10","jack","queen","king","ace"];

for(var kind of kinds){
	for(var color of colors){
		cards.push({color,kind});
	}
}

module.exports = cards;
module.exports.kinds = kinds;
module.exports.colors = colors;
