var {MongoClient} = require('mongodb')

var client = new MongoClient('mongodb://127.0.0.1:27017/')
var dbName = 'videogamestore'

async function connectDB() {
    try {
        await client.connect()
        console.log('Connected to MongoDB')

        var db = client.db(dbName)
        var usersCollection = db.collection('users')

        return {usersCollection}
    }
    catch(err) {
        console.log(err)
    }
}
module.exports = {connectDB}