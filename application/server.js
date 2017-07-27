const	express = require('express'),
		expressLayouts = require('express-ejs-layouts'),
		app = express(),
		bodyParser = require("body-parser"),
		http = require('http').Server(app),
		io = require('socket.io')(http),
		port = process.env.PORT || 3000,
		dbMng = require('./scripts/dbManager.js');

//DB manager settings
let dbManager = new dbMng();

//App settings
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)

app.use(expressLayouts);
app.use(bodyParser.json());
app.use('/public', express.static('public'));


function sendCounter() {
	let recordsCountRequest = dbManager.getTollboothRecordsCount();

    recordsCountRequest.then(function(count) {
    	io.emit('counterUpdate', count);
    });
}

function sendFare() {
	let fareRequest = dbManager.getFare();

    fareRequest.then(function(data) {
    	io.emit('fareUpdate', data[0].value);
    });
}

app.get('/', (req, res) => {
	let fareRequest = dbManager.getFare(),
		recordsCountRequest = dbManager.getTollboothRecordsCount(),
		fare;

    /*fareRequest.then(function(data) {
        fare = data[0].value;

        recordsCountRequest.then(function(count) {
        	console.log(data);*/
        	res.render('index', {
				activeTab : 1,
		    	tabTitle: 'Dashboard - TCSb',
		    	mainTitle: 'Dashboard',
		    	subTitle: 'Statistics Overview',
		    	jsfiles: ['plugins/morris/raphael.min.js', 'plugins/morris/morris.min.js', 'plugins/morris/morris-data.js', 'io-handler.js']
		    	//cJSFiles: ['plugins/morris/raphael.min.js', 'plugins/morris/morris.min.js', 'plugins/morris/morris-data.js', 'io-handler.js'],
		    	//fare: fare,
		    	//recordsCount: count
  			});
        /*});
    });*/
});

app.get('/settings', (req, res) => {
	let fareRequest = dbManager.getFare();

	fareRequest.then(function(data) {
        let fare = data[0].value;

		res.render('settings', {
	    	activeTab : 2,
		    tabTitle: 'Settings - TCSb',
		    mainTitle: 'Settings',
		    subTitle: '',
		    jsfiles: ['settings.js'],
		    fare: fare
	  	}); 
    });
});

app.get('/rest/getusers', (req, res) => {
	console.log('GetUsers Method Requested');
	let usersRequest = dbManager.getUsers();

	usersRequest.then(function(data) {
		res.json({"data": data});
    });
});

app.post('/rest/addrecord', (req, res) => {
	let ctime = new Date(),
		timeobj = {
			fulldate: ctime,
			year: ctime.getFullYear(),
			month: ctime.getMonth(),
			day: ctime.getDate(),
			hour: ctime.getHours(),
        	minute: ctime.getMinutes(),
        	seconds: ctime.getSeconds()
		};

	sendCounter();

    res.write('OK');
});

app.get('*', function(req, res){
   	res.render('404', {
    	activeTab : 0,
		tabTitle: 'Not found error - TCSb',
	 	mainTitle: '',
		subTitle: '',
  	});
});

io.on('connection', function(socket){
  	sendCounter();
  	sendFare();
});

http.listen(port, function(){
  	console.log('listening on *:' + port);
});