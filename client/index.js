var dom = require("react-dom");
var react = require("react");
var Game = require("./game");

dom.render([react.createElement(Game)],document.getElementById("container"));
