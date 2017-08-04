
const MongoClient = require('mongodb').MongoClient;

var self;

class dbManager {

    setup(){
        self = this;

        MongoClient.connect('mongodb://localhost:27017/tcsdb', (err, database) => {
            if (err) {
                console.log('=> Debug => Database connection error');
                return console.log(err);
            }
            self.db = database;
        });
    }

    getTollboothRecordsCount() {
        return self.db.collection('tollboothRecords').count();
    }

    getFare() {
        return self.db.collection('settings').find().toArray();
    }

    getUsers() {
        return self.db.collection('users').find({},{password:false}).sort({x:-1}).limit(100).toArray();
    }

    getChartInfo(type, limit) {
        console.log('type:' + type);
        console.log('limit:' + limit);
        //return self.db.collection('tollboothRecords').find({}).toArray();
    }

    updateFare(nVal) {
        return self.db.collection('settings').update({type: "fare"}, {type: "fare", value: nVal});
    }

    constructor() {
        this.setup(); 
    }
}

module.exports = dbManager;