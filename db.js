var {MongoClient} = require('mongodb')
var crypto = require('crypto')

var client = new MongoClient('mongodb://127.0.0.1:27017/')
var dbName = 'videogamestore'

async function connectDB() {
    try {
        await client.connect()
        console.log('Connected to MongoDB')

        var db = client.db(dbName)
        var usersCollection = db.collection('users')
        var gamesCollection = db.collection('games')

        var existingAdmin = await usersCollection.findOne({username: 'Administrator'})
        if (!existingAdmin) {
            var hash = crypto.createHash('sha256')
            var hashedPassword = hash.update('admin1234').digest('hex')
            var adminUser = {
                username: 'Administrator',
                password: hashedPassword,
                admin: true
            }
            await usersCollection.insertOne(adminUser)
            console.log('Admin account created.')
        }
        return {usersCollection, gamesCollection}
    }
    catch(err) {
        console.log(err)
    }
}
module.exports = {connectDB}