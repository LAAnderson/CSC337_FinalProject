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

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"))
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
            res.sendFile(path.join(__dirname, 'public', 'login.html'))
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"))
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
    res.sendFile(path.join(__dirname, "", 'storefront.html'))
})

app.get('/getproducts', async (req, res) => {
    try {
        const games = await gamesCollection.find({}).toArray();
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
