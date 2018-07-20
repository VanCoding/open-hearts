var Koa = require("koa");
var mount = require("koa-mount");
var compose = require("koa-compose");
var Static = require("koa-static");
var route = require("koa-route");
var upgrade = require("koa-upgrade");
var browserify = require("browserify");
var watchify = require("watchify");
var path = require("path");
var Match = require("./match");

var match = new Match();

var build = browserify({cache:{},packageCache:{},entries:[path.resolve(__dirname,"../client/index.js")],plugins:[watchify]});
var client = "";

function bundle(){
	build.bundle((err,bundle)=>{
		console.log(err,bundle);
		client = bundle;
		console.log("bundled");
	})
}
bundle();
build.on("update",bundle);

var app = new Koa();
upgrade(app);
app.use(mount("/public/react-playing-cards",Static("./node_modules/react-playing-cards/lib")))
app.use(mount("/public",Static("./public")));
app.use(
	compose([
		route.get("/client.js",async ctx=>{
			ctx.body = client;
		}),
		route.get("/connect",async ctx=>{
			var connection = await ctx.upgrade();
			match.takeSeat(connection);
			await(new Promise(()=>{}))
		}),
		route.get("/",async ctx=>{
			ctx.body = "hello world";
		})
	])
)

app.listen(80);
