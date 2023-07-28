
const jsmediatags = require("jsmediatags");
const fs = require("fs-extra");
var getMP3Duration = require('get-mp3-duration')
const func = require("./functions.js");
const NodeID3 = require('node-id3')
const ObjectId = require('mongodb').ObjectId;

var crypto = require('crypto');

var args = process.argv;
var IDcount = 0;

var pathMusic = args[2] || "public/music/";
var pathOut = args[3] || "data.json";

//console.log("music " + pathMusic)            //path where are saved the sogns
//console.log("output " + pathOut)             //path where we will save a json file 

var listObject = [];

function all() {
    return new Promise(function (resolve, reject) {

        fs.readdir(pathMusic, (err, songs) => {
            if (err) {
                //reject(err);
                console.log(err)
            }

            if (songs == undefined)
                throw "error"

            songs.forEach(song => {
                extractM(pathMusic, song)
                    .then((x) => {
                        listObject.push(x)

                        if (listObject.length == songs.length) {
                            fs.writeFile(pathOut, JSON.stringify(listObject))
                                .then(() => {
                                    resolve(listObject)
                                    return
                                })
                        }

                    });

            });
        });
    });
}

const getRanHex = () => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  
    for (let n = 0; n < 24; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }

function extractM(pathMusic, song) {
    return new Promise(function (resolve, reject) {
        new jsmediatags.read((pathMusic + song), {
            onSuccess: function (tag) {
                const buffer = fs.readFileSync(`${pathMusic + song}`)
                const duration = func.format_seconds(getMP3Duration(buffer) / 1000);

                var fileSize = fs.statSync(pathMusic + song).size;
                song = {
                    "_id": new ObjectId(getRanHex()),//crypto.createHash('md5').update(tag.tags.title).digest('hex'),  //update(fs.readFileSync(pathMusic + song))
                    "title": tag.tags.title,
                    "duration": duration,
                    "artist": tag.tags.artist,
                    "album": tag.tags.album,
                    "genre": tag.tags.genre,
                    "filename": song,
                    "src": pathMusic + song,
                    "size": fileSize,                                 
                    "desc": "" ,
                    "favourite": false,
                    "quality": 5
                }
                resolve(song)
            }
        },
            {
                onError: function (error) {

                    object = {
                        "id": IDcount++,
                        "title": "",
                        "duration": "",
                        "artist": "",
                        "album": "",
                        "genre": "",
                        "filename": "",
                        "src": "",
                        "size": "",
                        "desc": "",
                        "favourite": false,
                        "quality": 5
                    }

                    console.error(error.type, error.info);
                    resolve(song)
                }

            })
    })
}

function rempty(metadata) {
    // Removes empty fields
    Object.keys(metadata).forEach(k => {
        if(metadata[k]===undefined || (typeof metadata[k] == "string" && metadata[k].trim() == ""))
            delete metadata[k]
    })
    return metadata
}

function set_defaults(metadata) {
    const defaultMeta =
        {
            title: "",
            artist: "",
            album: "",
            genre: "",
            desc: "",
            favourite: false,
            quality: 5
        };
    Object.keys(defaultMeta).forEach((k)=>{
        metadata[k] = metadata[k] === undefined? defaultMeta[k]: metadata[k]
    })
    //console.log(metadata)
    return metadata
}

function getId3(metadata) {
    return rempty ({
            title: metadata.title,
            artist: metadata.artist,
            album: metadata.album,
            genre: metadata.genre,
            desc: metadata.desc,
            favourite: metadata.favourite,
            quality: metadata.quality
    })
}

function writeMetadata(filepath, tags={}) {
    return NodeID3.update(tags, filepath)
}

//all()
module.exports = {all, extractM, writeMetadata, getId3, set_defaults, rempty}

