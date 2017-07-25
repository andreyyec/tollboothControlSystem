
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

    findAllCollectionRecords(collection) {
        return self.db.collection(collection).find().toArray();
    }

    saveToDB(object) {
        console.log('Saving record to the database');
        let collection = self.db.collection('tollboothRecords');

        collection.insertOne(object,function(err, r) {
            if (err === null) {
                console.log('=>Debug: Record saved');
            }else{
                console.log('=>Debug: Error while trying to save record to Database');
                console.log('=>Debug: Error:' + err);
            }
        });
    }

    constructor() {
        this.setup(); 
    }
}

module.exports = dbManager;