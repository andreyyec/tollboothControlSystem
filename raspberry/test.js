/*Need to save into db
	tollboothRecords
		time
		farePaid

	settings
		taxFare

	users
		name
		username
		password	
*/

/*class Test {

	constructor() {

	}

	generateRecordObj() {
		let currentTime = new Date(),
			timeObject = self.generateTimeObj(currentTime),
			dbObject = {

			};


	}

	generateTimeObj(cTime) {
        let obj = {
            fulldate: cTime,
            hour: cTime.getHours(),
            minute: cTime.getMinutes(),
            seconds: cTime.getSeconds()
        };
        return obj;
    }

    saveToDB(object) {
        console.log('=>Debug: Saving record to the database');
        let that = this,
            collection = that.db.collection('tollBoothRecords');

        collection.insertOne(object,function(err, r) {
            if (err === null) {
                console.log('=>Debug: Record saved');
            }else{
                console.log('=>Debug: Error while trying to save record to Database');
                console.log('=>Debug: Error:' + err);
            }
        });
    }
}*/

const 	querystring = require('querystring'),
		http = require('http'),
		request = require('request'),
		connectionSettings = {
		    host: 'localhost',
		    port: 3000,
		    path: '/rest/addrecord',
		    method: 'POST'
		};


class Test {

	constructor() {
		this.sendData();
	}

	/*sendData() {
		let req,
			currentTime = new Date(),
			data = querystring.stringify({
		      time: currentTime
		    });

		connectionSettings.body = querystring.stringify({
	      	time: currentTime
	    });

		connectionSettings.headers = {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data)
	    };
		
		req = http.request(connectionSettings, function(res) {
		    res.setEncoding('utf8');
		    res.on('data', function (chunk) {
		        console.log("body: " + chunk);
			});
		});
		
		req.write(data);	
		req.end();
	}*/

	/*sendData() {
		request.post(
		    'http://localhost:3000/rest/addrecord',
		    { json: { key: 'value' } },
		    function (error, response, body) {
		    	console.log(body);
		        if (!error && response.statusCode == 200) {
		            console.log(body)
		        }
		    }
		);
	}*/
}

new Test();