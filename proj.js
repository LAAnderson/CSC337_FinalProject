var express = require('express')
var fs = require('fs')
var crypto = require('crypto')
var path = require('path')
var {MongoClient} = require('mongodb')
//form mongodb import MongoClient

var client = new MongoClient('mongodb://127.0.0.1:27017/')

var public_html = path.join(__dirname, 'public_html')

var app = express()

function findPromise(collName, search){
    return new Promise(function(resolve, reject){
        client.connect()
        .then(function(){
            var db = client.db('gameDB')
            var coll = db.collection(collName)
            return coll.find(search).toArray()
        })
        .then(function(arr){
            console.log(arr)
            resolve(arr)
        })
        .catch(function(err){
            console.log(err)
            reject(err)
        })
        .finally(function(){
            client.close()
        })
    }) 
}


app.get('/get_games', function(req, res){
    findPromise('games', {})
    .then(function(arr){
        res.send(arr)
    })
    .catch(function(err){
        console.log(err)
    })
})

app.get('/store.html', function(req, res){
    res.sendFile(path.join(public_html, 'store.html'))
})

app.get('/shoppingcart.html', function(req, res){
    res.sendFile(path.join(public_html, 'shoppingcart.html'))
})

app.post('/mng_action', express.urlencoded(), function(req, res){
    var query = req.body
    var gameObj = {'game_name':query.name, 'price':query.price}
    var user = localStorage.getItem('username')
    console.log('game', gameObj)
    insertPromise(user, gameObj)
    res.send('Adding to cart ...')
})

app.listen(8080, function (){
    console.log('here')
})



// STORE ON LOGIN SO THAT I CAN USE THIS FOR THE DB LATER
function storeUsername(){
    var username = document.getElementById('username').value
    window.localStorage.setItem('username', username)
}

// USE INSERT PROMISE WITH /mng_action FOR ADDING A GAME TO A USER'S CART



