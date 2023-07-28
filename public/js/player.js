


function init_songs() {

    var playlist;

    if (localStorage.length != 0) {
        var playlistSongs = JSON.parse(localStorage.playlist);
        playlistSongs = playlistSongs["songs"];
        playlist = new Playlist(playlistSongs);
    }
    else {
        playlist = new Playlist();
    }


    var fields = Object.keys(song_data[1]);  //extract all the keys from the object

    var asideR = document.getElementById("asideR");

    var song = document.querySelectorAll(".song");
    var song_table = document.querySelector(".song_table");
    var url = new URL(window.location)
    var params = url.searchParams

    var artist_filter = params.get("artist")
    var genre_filter = params.get("genre")
    var album_filter = params.get("album")

    var newTitle = document.title;
    var temp = [];

    var headgrid = `<header class="headgrid header">
                         <span></span>
                         <a id = "filename" href="songs.html?sort=filename">Filename</a>
                         <a href="songs.html?sort=duration">Duration (MM:SS)</a>
                         <a href="songs.html?sort=size">Size (MB)</a>
                         <a href="songs.html?sort=title">Title</a>
                         <a href="songs.html?sort=album">Album</a>
                         <a href="songs.html?sort=artist">Artist</a>
                         <a href="songs.html?sort=genre">Genre</a>
                         <a href="songs.html?sort=desc">Description</a>
                         <a href="songs.html?sort=quality">Quality</a>
                         <a href="songs.html?sort=favourite">Fav</a>
                    </header> <audio id="player-audio" style="display:none"></audio>`

    newTitle += artist_filter !== null ? ` - Artist: ${artist_filter}` : "";
    newTitle += genre_filter !== null ? ` - Genre: ${genre_filter}` : "";
    newTitle += album_filter !== null ? ` - Album: ${album_filter}` : "";
    document.title = newTitle

    //delete all songs from the html
    for (var i = 0; i < song.length; i++) {
        song[i].remove();
    }

    //generate new songs table with the button playlist
    for (var i = 0; i < song_data.length; i++) {
        song_table.innerHTML += generate_song_entry(song_data[i]);
    }


    if (artist_filter != null) {
        generaTab(find_by(song_data, { 'artist': artist_filter }), 'artist', artist_filter)
    }
    else if (genre_filter != null) {
        console.log(find_by(song_data, { 'genre': genre_filter }));
        generaTab(find_by(song_data, { 'genre': genre_filter }), 'genre', genre_filter)
    }
    else if (album_filter != null) {
        generaTab(find_by(song_data, { 'album': album_filter }), 'album', album_filter)
    }


    function generate_song_entry(song) {
        return `<article class="song" data-sid="${song._id}">
                        <a rel="play" href="player.html?src=${song.src}" target="player">Play</a>
                        <span class="filename">${song.filename}</span>
                        <span class="duration">${format_seconds(song.duration)}</span>
                        <span class="size">${song.size}</span>
                        <span class="title">${song.title}</span>
                        <span class="album">${song.album}</span>
                        <span class="artist">${song.artist}</span>
                        <span class="genre">${song.genre}</span>
                        <span class="desc">${song.desc}</span>
                        <span><progress class="quality" min="0" max="10" value="${song.quality}"></progress></span>
                        <button data-action="fav" id="fav_${song._id}" data-fav="true">&#9733;</button>
                        <button data-action="delete" id="delete_${song._id}">&#215;</button>
                        <a rel="edit" href="/music/${song._id}/edit">Edit</a>
                        <a rel="download" href="${song._id}" download>MP3</a>
                        <a rel="addSong" href="#" data-src="${song.src}">Add to playlist</a>
                    </article>`;
    }


    function generaTab(lista, campo, param) {
        for (var i = 0; i < song.length; i++) {
            song[i].style.display = "none";
        }
        switch (campo) {

            case "artist":
                {
                    song_table.innerHTML = headgrid;
                    for (var i = 0; i < lista.length; i++) {
                        song_table.innerHTML += generate_song_entry(lista[i])
                        if (!temp.includes(lista[i].album)) {
                            temp.push(lista[i].album)
                        }
                    }
                    song_table.innerHTML += `<p style="color:rgb(240, 81, 81); text-align:center">Canzoni trovate: ${lista.length}</p>`
                    asideR.innerHTML = `
                                             <section class="nav navR">
                                             <a>Album di ${param}</a>
                                             </section>`;
                    for (var i = 0; i < temp.length; i++) {
                        asideR.innerHTML += `
                                                           <section class="navR nav">
                                                             <a href="">${temp[i]}</a>
                                                              </section>`;
                    } break;
                }
            case "genre":
                {
                    song_table.innerHTML = headgrid;
                    for (var i = 0; i < lista.length; i++) {
                        song_table.innerHTML += generate_song_entry(lista[i])
                        if (!temp.includes(lista[i].artist)) {
                            temp.push(lista[i].artist)
                        }
                    }
                    song_table.innerHTML += `<p style="color:rgb(240, 81, 81); text-align:center">Canzoni trovate: ${lista.length}</p>`
                    asideR.innerHTML = `
                                                <section class="nav navR">
                                                <a>Artists ${param}</a>
                                                </section>`;
                    for (var i = 0; i < temp.length; i++) {
                        asideR.innerHTML += `
                                                 <section class="navR nav">
                                                 <a href="">${temp[i]}</a>
                                                 </section>`;
                    } break;
                }

            case 'album':
                {
                    song_table.innerHTML = headgrid;
                    for (var i = 0; i < lista.length; i++) {
                        song_table.innerHTML += generate_song_entry(lista[i])
                    } song_table.innerHTML += `<p style="color:rgb(240, 81, 81); text-align:center">Canzoni trovate: ${lista.length}</p>`
                    break;
                }
        }

    }



    var btnPlaylist = document.querySelectorAll(".song a[rel=addSong]")
    btnPlaylist.forEach((x) => {
        x.addEventListener("click", function (event) {

            if (playlist.songs.includes(event.target.dataset.src)) {
                var index = playlist.songs.indexOf(event.target.dataset.src)
                playlist.songs.splice(index, 1)
                localStorage.setItem("playlist", playlist.toJSON());
            }
        })

        // playlist.appendSong(event.target.dataset.src);
        // localStorage.setItem("playlist", playlist.toJSON());
    })

}

/**
 * Initialize the content of the index.html page as described in Task 3
 */
function init_home() {
    let genres = group_by(song_data, "genre");
    let albums = group_by(song_data, "album");
    let artists = group_by(song_data, "artist");
}


/**
 * @param {Array[Object]} a - Array of objects, which may contain at least field k
 * @param {String} k - The name of a field of the objects inside the array
 * @return {Object{Array[Object]}} - returns a dictionary which indexes the original Objects
 * contained in the Array a depending on the values of their field k.
 */
function group_by(a, k) {

    return a.reduce(function (totPrev, obj) {
        let key = obj[k];
        if (!totPrev[key]) {
            totPrev[key] = [];
        }
        totPrev[key].push(obj)
        return totPrev;
    }, {})

}


/**
 * @param {Array[Object]} a - Array of objects
 * @param {Object} f - Filter object, to be matched against the objects in the array
 * @return {Array[Object]}} - returns an array of the matching objects.
 * An object matches the filter if all non-undefined/non-null fields of the filter
 * are found with the same value in the object
 */

function find_by(a, f) {

    let result = [];
    let ks = [],
        vs = [];
    var check = true;
    for ([key, value] of Object.entries(f)) {
        if (value !== undefined && value !== null) {
            ks.push(key);
            vs.push(value);
        }
    }
    if (f == undefined) return result;
    a.filter(function (obj) {
        for (var i = 0; i < ks.length; i++) {
            //console.log(obj[ks[i]] + vs[i])
            if (obj[ks[i]] != vs[i]) {
                check = false;
                i = ks.length;
            } else {
                check = true;
            }
        }
        //console.log(result)
        if (check == true) { result.push(obj) }
    });
    return result;
}


//This is the constructor function stub for Task 5.
//If you prefer to use classes, feel free to change it accordingly.

class Playlist {
    constructor(songs = [], r = false) {
        this.songs = songs;
        this.repeat = r;
        this.index = 0;
    }

    toJSON() {
        return JSON.stringify({
            songs: this.songs,
            repeat: this.repeat,
            index: this.index
        });
    }

    load(json) {


        function isValidJSONString(str) {
            try {
                var x = JSON.parse(str);
                if (x["songs"] == null && x["index"] == null)
                    throw e;

            } catch (e) {
                return false;
            }
            return true;
        }
        if (isValidJSONString(json)) {

            var temp = JSON.parse(json);
            this.songs = temp["songs"];
            this.index = temp["index"];
            this.repeat = temp["repeat"];

        }


    }

    next() {

        if (this.index < this.songs.length) {
            if (this.index == this.songs.length - 1) {

                //  this.index++;
            }
            else {
                this.index++;
                var r = this.songs[this.index];
                return r;
            }
        }
        if (this.index == this.songs.length - 1) {
            if (this.repeat == false)
                return undefined;
            else if (this.repeat == true) {
                this.index = 0;
                var r1 = this.songs[this.index];
                //  this.index++;
                return r1;
            }
        }
    }

    prev() {
        if (this.index == 0) {
            if (this.repeat == false) {
                this.index = -1;
                return undefined;//this.songs[this.index];
            }
            if (this.repeat == true) {
                this.index = this.songs.length - 1
                return this.songs[this.index];
            }
        }
        else if (this.index > 0) {
            this.index--;
            return this.songs[this.index];
        }
    }

    appendSong(s) {
        for (var i = 0; i < this.songs.length; i++) {
            if (s == this.songs[i])
                return;
        }
        this.songs.push(s);
    }

    toHTML() {
        
        var html = `<h2>Playlist</h2>`;
        for (var i = 0; i < this.songs.length; i++) {
            console.log(this.songs[i].split('music/')[1])
            var cs = this.songs[i].split('music/')[1];
            html += `<section class="nav navR">
                <a href="${this.songs[i]}">${cs.split('.')[0]}</a>
            </section>`

        }
        return html;
    }
}




//Task 6
//Adapt and extend the code of init_player
function init_player_with_playlist(dom, key, songs) {

    var asideR = document.getElementById('asideR');
  //  var main = document.getElementById('player');

    if (localStorage.length != 0 || localStorage.getItem(key) != null) {
        var playlistSongs = JSON.parse(localStorage.getItem(key));
        playlistSongs = playlistSongs["songs"];
        console.log("sono nel player with playlist")
        console.log(playlistSongs)
        var pl = new Playlist(playlistSongs);
        asideR.innerHTML += pl.toHTML();
    }else
    { 
        var pl = new Playlist(playlistSongs);
        localStorage.setItem(key, pl.toJSON())
    }

    console.log(pl.songs)
    console.log(localStorage.getItem(key));

    dom.innerHTML = `  <header>
<p class="title">Playlist</p>
</header>

<article>    
<p id="nameSong"></p> 
<img id="imagePlayer" src="images/0.jpg">
</article>

<section class="seek"> 
<p id="elapsed">    </p>
<progress style="width: 330px; height: 10px;" id="timeProg"></progress>
<p id="remain">    </p>
</section>


<section class="player">

<button style="background-image: url(images/prev.svg);" class="small" id="prevP"></button>

<button style="background-image: url(images/pause.svg);" id="pause"></button>

<button style="background-image: url(images/play.svg);" id="play"></button>

<button style="background-image: url(images/next.svg);" class="small" id="nextP"></button>

<button style="background-image: url(images/repeat.svg); height: 65px;
width: 65px;" id="repeat" ></button>
</section>

<aside class="volume">
<button style="background-image: url(images/mute.svg);" id="mute"></button>
<button style="background-image: url(images/low.svg);" id="low"></button>
<button style="background-image: url(images/loud.svg);" id="loud"></button>
<input type="range" id="volumerange">
</aside>

<audio id="player-audio" style="display:none"></audio>`;

    var audio = document.getElementById('player-audio');
    init_player(audio, playlistSongs, true);
    console.log(playlistSongs)

    //bottone repeat
    var btnRepeat = document.getElementById("repeat");

    btnRepeat.addEventListener("click", function () {


        if (pl.repeat) {
            pl.repeat = false;
            localStorage.setItem(key, pl.toJSON());
        }
        else {
            pl.repeat = true;
            localStorage.setItem(key, pl.toJSON());
        }
    })

    var prevP = document.getElementById("prevP");
    var nextP = document.getElementById("nextP");
    let title = document.getElementById("nameSong");

    nextP.addEventListener("click", function () {
        console.log(pl.songs)
        if (pl.index != pl.songs.length) { pl.index++ }
        if (pl.index < pl.songs.length) {
            var tit = pl.songs[pl.index].split("/music/");
            title.innerHTML = tit[1];
            audio.src = pl.songs[pl.index];
            localStorage.setItem(key, pl.toJSON())
        } else if (pl.index >= pl.songs.length && pl.repeat == true) {
            pl.index = 0;
            var tit = pl.songs[pl.index].split("/music/");
            title.innerHTML = tit[1];
            audio.src = pl.songs[pl.index];
            localStorage.setItem(key, pl.toJSON())
        }
    })

    prevP.addEventListener("click", function () {
        if (pl.index != 0) { pl.index-- }
        if (pl.index >= 0) {
            var tit = pl.songs[pl.index].split("/");
            title.innerHTML = tit[1];
            audio.src = pl.songs[pl.index];
            localStorage.setItem(key, pl.toJSON())
            if (pl.index == 0)
                pl.index--;
        } else if (pl.index <= 0 && pl.repeat == true) {
            pl.index = pl.songs.length - 1;
            var tit = pl.songs[pl.index].split("/");
            title.innerHTML = tit[1];
            audio.src = pl.songs[pl.index];
            localStorage.setItem(key, pl.toJSON())
        }
    })

}



