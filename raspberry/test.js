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


class Test {

	constructor() {

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
            collection = that.db.collection('trafficRecords');

        collection.insertOne(object,function(err, r) {
            if (err === null) {
                console.log('=>Debug: Record saved');
            }else{
                console.log('=>Debug: Error while trying to save record to Database');
                console.log('=>Debug: Error:' + err);
            }
        });
    }
}

new Test();