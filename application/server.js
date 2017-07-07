/*const 	express = require('express'),
		expressLayouts = require('express-ejs-layouts'),
		app = express(),
		io = require('socket.io')(app),
		MongoClient = require('mongodb').MongoClient,
		dbMng = require('./scripts/dbManager.js');*/



const 	http = require('http'),
		express = require('express'),
		expressLayouts = require('express-ejs-layouts'),
    	app = module.exports.app = express();
		server = http.createServer(app);
		io = require('socket.io').listen(server),  //pass a http.Server instance
		MongoClient = require('mongodb').MongoClient,
		dbMng = require('./scripts/dbManager.js');


//DB manager settings
let dbManager = new dbMng();

//App settings
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use(expressLayouts);
app.use('/public', express.static('public'));

app.listen(3000, (req, res) => {
    console.log('listening on 3000')
});

//Web Sockets settings
/*io.on('connection', function (socket) {
  	socket.emit('speak', { hello: 'world' });
  	
  	socket.on('listen', function (data) {
    	console.log(data);
  	});
});*/

console.log('Socket IO UP');
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


app.get('/', (req, res) => {
	let records = dbManager.getTrafficRecordsCount();
    
    records.then(function(data){
        res.render('index', {
			activeTab : 1,
	    	tabTitle: 'Dashboard - TCSb',
	    	mainTitle: 'Dashboard',
	    	subTitle: 'Statistics Overview',
	    	records: data
  		});
    });

});

app.get('/settings', (req, res) => {
    res.render('settings', {
    	activeTab : 2,
	    tabTitle: 'Settings - TCSb',
	    mainTitle: 'Settings',
	    subTitle: '',
  	}); 
});

app.get('/testUri', function(req, res){
	console.log('REST');
});

// app.get('*', function(req, res){
//    	res.render('404', {
//     	activeTab : 0,
// 		tabTitle: 'Not found error - TCSb',
// 	 	mainTitle: '',
// 		subTitle: '',
//   	});
// });