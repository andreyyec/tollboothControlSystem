const 	express = require('express'),
		expressLayouts = require('express-ejs-layouts'),
		app = express(),
		io = require('socket.io')(app),
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

app.get('*', function(req, res){
   	res.render('404', {
    	activeTab : 0,
		tabTitle: 'Not found error - TCSb',
	 	mainTitle: '',
		subTitle: '',
  	});
});