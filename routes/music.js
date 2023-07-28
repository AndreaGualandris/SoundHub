/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: Andrea Gualandris
 *
 * /songs API router
 *
 *
 */

/**
 * TODO: REPLACE WITH THE music.js FILE FROM YOUR PREVIOUS ASSIGNMENT
 * THEN REWRITE TO READ/WRITE TO THE DATABASE INSTEAD OF THE data.json FILE
 */

const express = require('express');
const router = express.Router();
module.exports = router;
const functions = require('../functions');
const ObjectId = require('mongodb').ObjectId;

const jsmediatags = require('jsmediatags');
const fs = require('fs-extra');

const metadata = require('../metadata');
const models = require('../models').model;

const phr = "public"
const pathMusic = phr + "/music/"

const { eventBus } = require('../ws.js');

//start mongod --dbpath ~/mongodb


router.get('/upload', function (req, res) {
    if (req.accepts("text/html"))
        res.render("../views/upload.ejs")
    return;
})


/* router.get('/andrea/:id', (req, res) => {


    var fields = {

        title : req.params.title, 
        artist : "art",
        genre : "o"

    }

    models.music.findOneAndDelete({_id : new ObjectId(req.params.id)}).then(()=>{
    res.end();
    })
    
}) */

router.get("/:id?", (req, res) => {
    try {
        if (req.params.id) {
            var filter = { _id: new ObjectId(req.params.id) }
            console.log(filter)
            models.music.findOne(filter).then(
                (result) => {
                    console.log(result)
                    if (result !== null) {
                        if (req.accepts("application/json")) {
                            res.status(200).json(result);
                            res.end();
                        }
                        else if (req.accepts("text/html")) {
                            res.render("../views/player.ejs", { song: result })
                            res.end();
                        }
                    } else {
                        console.log("The id isn't in the collection")
                        res.status(404).end();
                    }

                })
                .catch((error) => {
                    console.error(error);

                    res.status(404).end();
                })
        } else {                               // GET /songs || GET /songs?artist&album&genre

            filter_data = metadata.rempty({
                artist: req.query.artist,
                album: req.query.album,
                genre: req.query.genre,
            })

            if ((filter_data !== undefined || filter_data !== null) && req.query.search) {
                filter_data = {
                    $or: [{ "artist": { $regex: req.query.search } },
                    { "album": { $regex: req.query.search } },
                    { "title": { $regex: req.query.search } },
                    { "filename": { $regex: req.query.search } },
                    { "desc": { $regex: req.query.search } }]
                }
            }

            models.music.find(filter_data).toArray().then(
                (result) => {

                    if (req.accepts("application/json")) {
                        res.status(200).json(result);
                        res.end();
                    }
                    else if (req.accepts("text/html")) {
                        res.render("../views/music.ejs",
                            {
                                filter: filter_data,
                                functions,
                                songs_data: result

                            })
                    }
                }).catch((error) => {
                    console.error(error);
                    res.status(404).end();
                })
        }
    } catch (err) {
        console.error(err);
        res.status(404).end();
    }
})



router.get("/:id/edit", (req, res) => {

    var filter = { _id: new ObjectId(req.params.id) }
    models.music.findOne(filter).then(song => {

        if (req.params.id && (song == undefined || song == null)) {
            res.status(404).end()
            return
        }
        if (req.accepts("text/html")) {
            res.render("../views/edit.ejs", { song: song })
        }
        if (req.accepts("application/json")) {
            res.json(song);
        }
    })
})



router.post('/', function (req, res) {
    if (!req.files) {
        res.status(400).send("Missing File - Try again")
        return
    }
    var file = req.files["file"]
    uploadPath = pathMusic + file.name
    filename = file.name;
    fields = metadata.getId3(req.body)

    file.mv(uploadPath)
        .then((err) => {
            if (err) throw err

            console.log("File uploaded")

            return metadata.extractM(pathMusic, filename)
        })
        .then((tags) => {
            Object.keys(fields).forEach(k => {
                if (k == "favourite") {
                    if (fields[k] == 'true')
                        fields[k] = true
                    else
                        fields[k] = false
                }
                tags[k] = fields[k]
            })
            models.music.insertOne(tags)
                .then(
                    () => {

                        eventBus.emit('newSong');  // call the event newSong with the obj song

                        if (req.accepts('application/json')) {
                            console.log(tags)
                            res.status(201).json(tags)
                        }
                        else if (req.accepts('text/html')) {
                            res.method = "GET"
                            res.redirect(`/songs/`)
                        }
                    }
                )
        })
})


router.put('/:id', function (req, res) {

    try {
        var filter = { _id: new ObjectId(req.params.id) }
        console.log(req.body)
        let form_fields = metadata.getId3(metadata.set_defaults(req.body))
        console.log(form_fields);

        models.music.findOne(filter).then(result => {
            console.log("result " + result)
            if (result !== undefined && result != null) {

                if (req.files && Object.keys(req.files).length > 0) {
                    console.log("sono nel 1 put")

                    let file = req.files["file"]
                    let filename = file.name
                    let uploadPath = pathMusic + filename

                    fs.unlink(result.src);

                    file.mv(uploadPath).then(
                        (err) => {
                            if (err) throw err;

                            metadata.extractM(pathMusic, uploadPath.split('music/')[1]) //or filename
                                .then(
                                    (metadata) => {

                                        metadata._id = result._id;

                                        Object.keys(result).forEach(k => {
                                            if (k == "favourite") {
                                                if (result[k] == 'true')
                                                    metadata[k] = true
                                                else
                                                    metadata[k] = false
                                            }
                                            result[k] = metadata[k];
                                        })

                                        Object.keys(form_fields).forEach(k => {
                                            if (k == "favourite") {
                                                if (form_fields[k] == 'true')
                                                    form_fields[k] = true
                                                else
                                                    form_fields[k] = false
                                            }
                                            result[k] = form_fields[k];
                                        })
                                    }).then(
                                        () => {

                                            models.music.replaceOne(filter, result, { upsert: true }).then(out => {

                                                // eventBus.emit('updateSong', JSON.stringify(result));

                                                if (req.accepts('text/html')) {
                                                    res.method = "GET"
                                                    res.redirect(`/songs/`)

                                                }
                                                else if (req.accepts('application/json')) {
                                                    res.status(200).json(result)
                                                }
                                            })
                                            return
                                        })
                        });
                }
                else {

                    console.log("[-] No files in input, updating mediatags only.")
                    console.log(form_fields)
                    Object.keys(form_fields).forEach(k => {
                        if (k == "favourite") {
                            if (form_fields[k] == 'true')
                                form_fields[k] = true
                            else
                                form_fields[k] = false
                        }
                        if (k == "desc") {
                            if (form_fields[k] == "")
                                form_fields[k] = " ";
                        }
                        result[k] = form_fields[k]
                    })


                    models.music.replaceOne(filter, result, { upsert: true }).then(out => {

                        // eventBus.emit('updateSong', JSON.stringify(result));

                        if (req.accepts('application/json')) {
                            res.status(200).json(result)
                        }
                        else if (req.accepts('text/html')) {
                            res.method = "GET"
                            res.redirect(`/songs/`)

                        }
                    })
                }
            } else {
                if (req.files && Object.keys(req.files).length > 0) {
                    console.log("sono nel 3 put")
                    let file = req.files["file"]
                    let filename = file.name
                    let uploadPath = pathMusic + filename

                    file.mv(uploadPath)
                        .then((err) => {
                            if (err) throw err
                            metadata.extractM(pathMusic, filename)
                                .then(
                                    (obj) => {
                                        Object.keys(form_fields).forEach(k => {
                                            if (k == "favourite") {
                                                if (form_fields[k] == 'true')
                                                    form_fields[k] = true
                                                else
                                                    form_fields[k] = false
                                            }
                                            obj[k] = form_fields[k]
                                        })
                                        obj._id = new ObjectId(req.params.id)


                                        models.music.insertOne(obj).then(
                                            (result) => {

                                                // eventBus.emit('updateSong', JSON.stringify(obj));

                                                if (req.accepts('application/json')) {
                                                    res.status(201).json(obj)
                                                }
                                                else if (req.accepts('text/html')) {
                                                    res.method = "GET"
                                                    res.redirect(`/songs/`)
                                                }
                                            })
                                    })
                        })
                }
                else {
                    res.status(404).end();
                    return;
                }
            }
        })
    } catch (error) {
        console.log("errore nel filter" + error)
        res.status(404).end()
    }
})

router.delete('/:id', function (req, res) {
    var filter = { _id: new ObjectId(req.params.id) }
    var id = { id: req.params.id };

    models.music.findOneAndDelete(filter)
        .then(
            (result) => {

                id.src = result.value.src;

                eventBus.emit('deleteSong', id);

                console.log(result)
                if (result.value == null) {
                    console.log("The id isn't in the collection")
                    res.status(404).end();
                }
                else {

                    fs.unlink(result.value.src, function (err) {
                        if (err) { throw err }
                        res.status(204)
                        if (req.accepts('application/json'))
                            res.json(result)
                        else if (req.accepts('text/html'))
                            res.redirect('/songs/')
                        res.end()
                    })
                }
            })
        .catch(
            (error) => {
                console.log(error);
                res.status(404).end();
            })
});
