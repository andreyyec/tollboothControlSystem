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
	res.render('index', {
		activeTab : 1,
    	tabTitle: 'Dashboard - TCSb',
    	mainTitle: 'Dashboard',
    	subTitle: 'Statistics Overview',
    	jsfiles: ['io-handler.js', 'plugins/morris/raphael.min.js', 'plugins/morris/morris.min.js', 'charts.js']
	});
});

app.get('/settings', (req, res) => {
	let fareRequest = dbManager.getFare();

	fareRequest.then(function(data) {
		res.render('settings', {
	    	activeTab : 2,
		    tabTitle: 'Settings - TCSb',
		    mainTitle: 'Settings',
		    subTitle: '',
		    jsfiles: ['bootstrap-modal.js','settings.js'],
		    fare: data[0].value
	  	}); 
    });
});

app.get('/rest/getusers', (req, res) => {
	let usersRequest = dbManager.getUsers();

	usersRequest.then(function(data) {
		res.json({"data": data});
    });
});

app.post('/rest/addrecord', (req, res) => {
	let ctime = new Date(),
		storeObj = {
			deviceUID: req.body.uid,
			farePaid : 0,
			fulldate: ctime,
			year: ctime.getFullYear(),
			month: ctime.getMonth(),
			day: ctime.getDate(),
			hour: ctime.getHours(),
        	minute: ctime.getMinutes(),
        	seconds: ctime.getSeconds()
			
		},
		fareRequest = dbManager.getFare();

    fareRequest.then(function(data) {
    	storeObj.farePaid = data[0].value;

    	let tollboothSaveRequest = dbManager.saveTollboothRecord(storeObj);
    	
    	tollboothSaveRequest.then(function(data) {
			sendCounter();
		});
    });

    res.write('OK');
    res.status(200).end();
});

app.post('/rest/updatefare', (req, res) => {
	let fareUpdateRequest = dbManager.updateFare(req.body.fare);

	fareUpdateRequest.then(function(data) {
		if (data.result.nModified > 0) {
			io.emit('fareUpdate', req.body.fare);
			res.status(200).end('{"status":200, "modified":true, "msj":"Updated Successfully"}');
		} else {
			res.status(200).end('{"status":500, "modified":false, "msj":"Error while trying to update fare value"}');
		}
	});
});

app.post('/rest/getchartdata', (req, res) => {
	let chartDataRequest = dbManager.getChartInfo(req.body.type, req.body.limit);

	// chartDataRequest.then(function(data) {
	// 	if (data.result.nModified > 0) {
	// 		io.emit('fareUpdate', req.body.fare);
	// 		res.status(200).end('{"status":200, "modified":true, "msj":"Updated Successfully"}');
	// 	} else {
	// 		res.status(200).end('{"status":500, "modified":false, "msj":"Error while trying to update fare value"}');
	// 	}
	// });

	res.status(200).end('{"status":200, "modified":false, "msj":"Rest service working"}');
});

app.post('/rest/deleteuser', (req, res) => {
	let userDeleteRequest = dbManager.deleteUser(req.body.id);

	userDeleteRequest.then(function(data) {
		if (data.result.deletedCount > 0) {
			res.status(200).end('{"status":200, "deleted":true, "msj":"User deleted Successfully"}');
		} else {
			res.status(200).end('{"status":500, "deleted":false, "msj":"Error while trying to remove user from database"}');
		}
	});

	res.status(200).end('{"status":200, "modified":false, "msj":"Rest service working"}');
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