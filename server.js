const express = require('express')
const app = express()
const crypto = require('crypto')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const path = require('path')

const {connectDB} = require('./db')
var usersCollection
var gamesCollection

//Connects Database to server.
connectDB().then(collections => {
    usersCollection = collections.usersCollection
    console.log('usersCollection is ready')

    gamesCollection = collections.gamesCollection
    gamesCollection.createIndex({"name": "text"})
    console.log('gamesCollection is ready')

    app.listen(8080, () => {
        console.log('Server Running on port 8080....')
    })
})

var sessionList = []

//List will hold everyone currently logged in.
function checkSession(username) {
    for(var i=0; i<sessionList.length; i++) {
        if(sessionList[i].username == username) {
            return true
        }
    }
    return false
}

app.use(express.static('public'));

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'signup.html'))
})

app.post('/signup', express.urlencoded(), (req,res) => {
    var query = req.body
    var hash = crypto.createHash('sha256')
    var hashedPassword = hash.update(query.password).digest('hex')
    //Check for existing users
    usersCollection.find({username: query.username}).toArray()
        .then(existingUsers => {
            if(existingUsers.length > 0) {
                return res.send("Username is already taken. <a href='/signup.html'>Try again</a>")
            }
            //Add new user
            return usersCollection.insertOne({username: query.username, password: hashedPassword})
        })
        .then(() => {
            res.sendFile(path.join(__dirname, "public", 'login.html'))
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'login.html'))
})

app.post('/login', express.urlencoded(), (req,res) => {
    var query = req.body
    var hash = crypto.createHash('sha256')
    var hashedPassword = hash.update(query.password).digest('hex')
    //Attempt login.
    usersCollection.find({username: query.username, password: hashedPassword}).toArray()
        .then(usersFound => {
            if(usersFound.length > 0) {
                //Successful login
                sessionList.push({username: query.username})
                res.sendFile(path.join(__dirname, "public", 'storefront.html'))
            }
            else {
                //Failed login attempt
                res.send("Invalid username or password. <a href='/login.html'>Try again</a>")
            }
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'storefront.html'))
})

app.get('/getproducts', async (req, res) => {
    try {
        var targetGames
        if (req.query['searchbar']) {
            targetGames = { "$text": { "$search": req.query['searchbar']}}
        } else {
            const genres = [].concat(req.query['genre[]'] || [])
            const ratingRanges = [].concat(req.query['rating[]'] || [])
            const priceRanges = [].concat(req.query['price[]'] || [])

            var genreObj = null
            var ratingObj = null
            var priceObj = null

            if (genres.length > 0)
                genreObj = {"genre": {"$in": genres}}

            if (ratingRanges.length > 0) {
                ratingObj = {"$or": []}
                ratingRanges.forEach(rating => {
                    switch (rating) {
                        case "0-1":
                            ratingObj.$or.push({"rating": {"$gte": 0, "$lte": 1}})
                            break;
                        case "1-2":
                            ratingObj.$or.push({"rating": {"$gte": 1, "$lte": 2}})
                            break;
                        case "2-3":
                            ratingObj.$or.push({"rating": {"$gte": 2, "$lte": 3}})
                            break;
                        case "3-4":
                            ratingObj.$or.push({"rating": {"$gte": 3, "$lte": 4}})
                            break;
                        default:
                            ratingObj.$or.push({"rating": {"$gte": 4}})
                        break
                    }
                })
            }

            if (priceRanges.length > 0) {
                priceObj = {"$or": []}
                priceRanges.forEach(price => {
                    switch (price) {
                        case "0-10":
                            priceObj.$or.push({"price": {"$gte": 0, "$lte": 10}})
                        break;
                        case "10-20":
                            priceObj.$or.push({"price": {"$gte": 10, "$lte": 20}})
                        break;
                        case "20-30":
                            priceObj.$or.push({"price": {"$gte": 20, "$lte": 30}})
                        break;
                        case "30-40":
                            priceObj.$or.push({"price": {"$gte": 30, "$lte": 40}})
                        break;
                        case "40-50":
                            priceObj.$or.push({"price": {"$gte": 40, "$lte": 50}})
                        break;
                        default:
                            priceObj.$or.push({"price": {"$gte": 50}})
                        break;
                    }
                })
            }

            targetGames = {"$and": []}
            if (genreObj)
                targetGames.$and.push(genreObj);
            if (ratingObj)
                targetGames.$and.push(ratingObj);
            if (priceObj)
                targetGames.$and.push(priceObj);

            if (!(genreObj || ratingObj || priceObj))
                targetGames = {};
        }


        console.log(JSON.stringify(targetGames))

    
        const games = await gamesCollection.find(targetGames, {"collation": {"locale": 'en', "strength": 1, "caseLevel": true}}).toArray();
        res.json(games) 
    } catch (err) {
        console.error(err)
        res.status(500)
    }
})

app.get('/shoppingcart', (req, res) => {

})

app.get('/search', (req, res) => {

})
