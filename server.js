const express = require('express')
const app = express()
const crypto = require('crypto')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const path = require('path')

var users = []

function checkLogin(username, password) {
    for(var i=0; i<users.length; i++) {
        var cur = users[i]
        if((cur.username == username) && (cur.password == password)) {
            return true
        }
    }
    return false
}

app.listen(8080, () => {
    console.log('Server Running on port 8080....')
})

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"))
})

app.post('/signup', express.urlencoded(), (req,res) => {
    var query = req.body
    var hash = crypto.createHash('sha256')
    var hashedPassword = hash.update(query.password).digest('hex')

    for(var i=0; i<users.length; i++) {
        var cur = users[i]
        if(cur.username == query.username) {
            alert("Username is already taken please choose another.")
            return
        }  
    }
    users.push({'username':query.username, 'password':hashedPassword})
    res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.post('/login', express.urlencoded(), (req,res) => {
    var query = req.body
    var hash = crypto.createHash('sha256')
    var hashedPassword = hash.update(query.password).digest('hex')
    if(checkLogin(query.username, hashedPassword)) {
        res.sendFile(path.join(__dirname, "public", 'storefront.html'))
    }
    else {
        res.sendFile(path.join(__dirname, "public", 'signup.html'))
    }
})

app.get('/storefront', (req, res) => {

})

app.get('/shoppingcart', (req, res) => {

})

app.get('/search', (req, res) => {

})
