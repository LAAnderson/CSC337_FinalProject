var {MongoClient} = require('mongodb')
var crypto = require('crypto')
var fs = require('fs')

var client = new MongoClient('mongodb://127.0.0.1:27017/')
var dbName = 'videogamestore'

async function connectDB() {
    try {
        await client.connect()
        console.log('Connected to MongoDB')

        var db = client.db(dbName)
        var usersCollection = db.collection('users')
        var gamesCollection = db.collection('games')
        var cartsCollection = db.collection('carts')

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

        var existingGames = await gamesCollection.countDocuments()
        if(existingGames == 0) {
            var gamesData = JSON.parse(fs.readFileSync('games.json', 'utf-8'))
            await gamesCollection.insertMany(gamesData)
            console.log('Games data loaded')
        } else {
            console.log('Games collection already has data')
        }

        return {usersCollection, gamesCollection, cartsCollection}
    }
    catch(err) {
        console.log(err)
    }
}
module.exports = {connectDB}