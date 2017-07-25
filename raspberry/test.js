const 	request = require('request'),
		uid = '200111z';

class Test {

	constructor() {
		this.sendRequest();
	}

	sendRequest() {
		request.post('http://localhost:3000/rest/addrecord', {json:{uid:uid}},
		    function (error, response, body) {
		    	console.log(body);
		        if (!error && response.statusCeeode == 200) {
		            console.log(body)
		        }
		    }
		);
	}
}

new Test();