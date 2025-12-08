var {MongoClient} = require('mongodb')

var client = new MongoClient('mongodb://127.0.0.1:27017/')
var dbName = 'videogamestore'

async function connectDB() {
    try {
        await client.connect()
        console.log('Connected to MongoDB')

        var db = client.db(dbName)
        
        return {usersCollection: db.collection('users'),
                gamesCollection: db.collection('games')}
    }
    catch(err) {
        console.log(err)
    }
}
module.exports = {connectDB}