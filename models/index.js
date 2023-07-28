/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: Andrea Gualandris
 *
 * Task 1
 *
 */

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const MongoClient = mongodb.MongoClient;

const mongodb_uri = 'mongodb://localhost:27017';
const db_name = 'web-atelier-ex';
const collection_name = 'music';

const model = {};


MongoClient
    .connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client=>{
        console.log("[@] Connected to: " + mongodb_uri);
        model.db = client.db(db_name);
        model.music = model.db.collection(collection_name);

        //Task 2
        //TODO uncomment this to call your module
        //require('./sync').check(model.music, __dirname + "/../public/music").then(console.log);

    })
    .catch(err => console.error(err));


exports.model = model;