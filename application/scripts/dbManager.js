
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

    deleteUser(userid) {
        return self.db.collection('users').deleteOne({'_id':ObjectId(userid)});
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
        let sTime, eTime,
            currentDate = new Date;

        switch (limit) {
            case 'day':
                sTime = currentDate.setHours(0,0,0,0);
                eTime = currentDate.setHours(23,59,59,999);
            break;
            case 'week':
                sTime = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).setHours(0,0,0,0);
                eTime = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()+6)).setHours(23,59,59,999);
            break;
            case 'month':
                sTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).setHours(0,0,0,0);
                eTime = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).setHours(23,59,59,999);
            break;
            case 'year':
                sTime = new Date(currentDate.getFullYear(), 0, 1).setHours(0,0,0,0);
                eTime = new Date(currentDate.getFullYear(), 11, 31).setHours(23,59,59,999);;
            break;
        }

        if (type === 'fare' || type === 'count') {
            return self.db.collection('tollboothRecords').find({ startTime: { $gte: sTime, $lt: eTime}}).toArray();
        } else {
            return {status: 'error'};
        }        
    }

    updateFare(nVal) {
        return self.db.collection('settings').update({type: "fare"}, {type: "fare", value: nVal});
    }

    saveTollboothRecord (storeObj) {
        return self.db.collection('tollboothRecords').insert(storeObj);
    }

    constructor() {
        this.setup(); 
    }
}

module.exports = dbManager;