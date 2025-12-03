const express = require('express')
const app = express()
const crypto = require('crypto')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')
const path = require('path')

app.listen(8080, () => {
    console.log('Server Running on port 8080....')
})

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"))
})

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.get('/storefront', (req, res) => {

})

app.get('/shoppingcart', (req, res) => {

})

app.get('/search', (req, res) => {

})
