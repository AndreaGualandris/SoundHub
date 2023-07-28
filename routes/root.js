/**
 * Web Atelier 2021  Exercise 5 - Express and EJS
 *
 * Student: Andrea Gualandris
 *
 *  /* API router
 *
 *
 */


const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const functions = require('../functions.js')
module.exports = router
const data = require("../songs_data")
const models = require('../models').model


router.get('/', (req, res) => {
    res.redirect('index');
}) 

 
router.get("/index", (req, res) => {
    models.music.find({}).toArray().then(
        (result) => {
            if (req.accepts("application/json")) {
                res.json(result)
            }
            else if (req.accepts("text/html")) {
                res.render("../views/index.ejs", { functions, songs_data: result });
            }

        }).catch((error) => {
            console.error(error);
            res.status(404).end();
        })
}) 


router.get("/*", (req, res) => {
    console.log(process.cwd() + req.path)
    if (fs.pathExistsSync(process.cwd() + req.path)) {
        res.status(200).sendFile(process.cwd() + req.path)
    } else
        res.status(404).end()
})

router.get("/player/remote", (req, res) => {
    res.status(200).json({object : "Player-remote"});

})