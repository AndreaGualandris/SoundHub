
let socket = io();


function my_fetch() {

    console.log("start fetching")


    //utilities
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

    function clear_main() {
        let main = document.querySelector("main");
        if (main)
            main.remove();
    }


    document.getElementById("page_remote").addEventListener("click", (e) => {
        e.preventDefault();

        fetch("/player/remote", { headers: { "Accept": "application/json" } })
            .then(() => {
                return ejs.views_remote()
            })
            .then((html) => {
                document.querySelector("main").innerHTML = html
                document.location.hash = '#remote'

                document.querySelector('main #play').addEventListener("click", () => {
                    socket.emit('play');
                })
                document.querySelector('main #pause').addEventListener("click", () => {
                    socket.emit('pause');
                })

                document.querySelector("main #next").addEventListener('click', () => {
                    socket.emit('next');
                })

            })
    })

    document.getElementById("page_songs").addEventListener("click", (e) => {
        e.preventDefault();
        let url = new URL(e.currentTarget.href);

        if (url.pathname == "/songs") {
            generate_table();

        }
    });


    //const functions = require("../../functions")

    // index link
    document.getElementById("page_home").addEventListener('click', (e) => {

        e.preventDefault();
        let url = new URL(e.currentTarget.href);

        if (url.pathname == "/") {
            fetch("/index", { method: 'GET', headers: { Accept: 'application/json' } })
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error(res.status);
                    }
                    return res.json();
                })
                .then(result => {

                    artists = group_by(result, 'artist');
                    albums = group_by(result, 'album');
                    genres = group_by(result, 'genre');

                    let html = ejs.views_index({ n: { numSongs: result.length, numGenres: Object.keys(genres).length, numArtists: Object.keys(artists).length }, artists: artists });
                    let main = document.querySelector(".contain .asideL");

                    clear_main();

                    main.insertAdjacentHTML("afterend", html);

                    document.location.hash = "#index";
                })
                .catch(err => {
                    console.error(err);
                });
        }
    });


    document.getElementById("page_upload").addEventListener('click', (e) => {

        e.preventDefault();

        let url = new URL(e.currentTarget.href);

        //if (url.pathname == "music/upload") {
        fetch("/songs/upload")
            .then(res => {
                return res.text();
            })
            .then(obj => {

                let htmlUpload = ejs.views_upload(obj);
                let asideL = document.querySelector(".contain .asideL");

                clear_main();

                asideL.insertAdjacentHTML("afterend", htmlUpload);
                document.location.hash = "#upload";

                let form = document.querySelector("form");
                form.addEventListener("submit", (event) => {
                    event.preventDefault();
                    let body = new FormData(form);

                    fetch("/songs", { method: "POST", body })
                        .then(res => {
                            console.log(res.status);
                            return res.json();
                        })
                        .then(songs => {
                            console.log(songs);
                        })
                        .then(() => generate_table())
                })
            })
        //  }
    });



    document.getElementById('page_playlist').addEventListener('click', (event) => {
        event.preventDefault();

        let url = new URL(event.currentTarget.href);
        //if (url.pathname == '/player') {
        document.querySelector(".contain .asideR").innerHTML = ""
        document.querySelector(".contain main").id = "player"
        document.location.hash = '#player';
        // document.querySelector("footer #player").remove()

        document.querySelector('main').innerHTML = '';
        // let dom = document.querySelector('.player');
        init_player_with_playlist(document.querySelector('main'), "pl");

        document.querySelectorAll(".asideR .navR").forEach((x) => {
            x.addEventListener("click", function (event) {

                event.preventDefault();

                //init_player_with_playlist(document.querySelector('main'), "pl");
                console.log(x.children[0].href);
                // init_player(document.querySelector('.mainContent #player-audio'), localStorage.getItem('pl'), true)
                document.querySelector('.contain main #player-audio').src = x.children[0].href;
                document.querySelector('.contain main #nameSong').innerHTML = x.children[0].href.split('music/')[1];
            })
        })

        //  }

    })



    function btn_add_playlist() {

        var btnPlaylist = document.querySelectorAll(".song a[rel=addSong]")
        btnPlaylist.forEach((x) => {
            x.addEventListener("click", function (event) {

                console.log(x)
                var playlist;
                document.location.hash = "#songs";

                socket.emit("updateLocalStorage", event.target.dataset.src);

                /*  if (localStorage.length != 0 || localStorage.getItem("pl") != null) {
                     var playlistSongs = JSON.parse(localStorage.getItem("pl"));
                     playlistSongs = playlistSongs["songs"];
                     playlist = new Playlist(playlistSongs);
                     asideR.innerHTML = playlist.toHTML();
                 } else {
                     playlist = new Playlist();
                     localStorage.setItem('pl')
                 }
                 console.log("contenuto della playlist oggetto");
                 console.log(playlist);
                 console.log("contenuto del localstorage");
                 console.log(JSON.parse(localStorage.getItem("pl"))["songs"])
                 if (playlist.songs.includes(event.target.dataset.src)) {
                     var index = playlist.songs.indexOf(event.target.dataset.src)
                     playlist.songs.splice(index, 1)
                     localStorage.setItem("pl", playlist.toJSON());
                     asideR.innerHTML = playlist.toHTML();
                 } else {
                     playlist.appendSong(event.target.dataset.src);
                     localStorage.setItem("pl", playlist.toJSON());
                     asideR.innerHTML = playlist.toHTML();
                 } */


            })


        })
    }



    function clear_player() {
        let playerP = document.querySelector("#player");
        if (playerP)
            playerP.remove();
    }

    function generate_table() {

        fetch("/songs",
            {
                headers: { "Accept": "application/json" }
            }).then(
                (res) => {
                    return res.json();
                }).then(
                    (songs) => {
                        console.log("Lista oggetti canzoni : " + songs)

                        artists = group_by(songs, 'artist');
                        albums = group_by(songs, 'album');
                        genres = group_by(songs, 'genre');

                        //genera asideR con genres 
                        // console.log(artist)
                        var songsList = {
                            songs_data: songs
                        }

                        let htmlMusic = ejs.views_songs_table(songsList);

                        //let song = songs[0];
                        clear_main()
                        let asideL = document.querySelector(".contain .asideL");
                        asideL.insertAdjacentHTML("afterend", htmlMusic);

                        var asideR = document.querySelector('#asideR');
                        asideR.innerHTML = ``;

                        let htmlAsideR = ejs.views_includes_asideR({ value: genres, field: "genre" })

                        asideR.innerHTML = htmlAsideR;
                        document.location.hash = "#songs";

                        delete_song()
                        edit_song()
                        song_play()
                        btn_add_playlist()

                        filter_song_listener()
                        filter_song_nav_genre(artists, albums)

                        add_favourite_listener()

                    }).catch(err => {
                        console.error(err);
                    });
    }

    function add_favourite_listener() {
        var btn_favourite = document.querySelectorAll('.song .favourite');
        btn_favourite.forEach((x) => {
            x.addEventListener("click", click_favourite)
        })
    }

    function click_favourite(event) {
        event.preventDefault();
        let url = new URL(event.currentTarget.parentNode.action)
        var body
        /* 
                form = document.querySelector('form')
                body = new FormData(form);  */


        if (event.currentTarget.dataset.fav == "true")
            body = { favourite: true };
        else if (event.currentTarget.dataset.fav == "false")
            body = { favourite: false };

        console.log(body)
        fetch(url.pathname, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { "Accept": "application/json" }
        }).then((res) => {
            return res.json();
        }).then((json) => {

            let btn = document.querySelector(`[data-id="${json._id}"] .favourite`);
            console.log(btn)
            console.log(json)

            if (btn.id == "fav_on")
                btn.id = " ";
            else
                btn.id = "fav_on";

            if (json.favourite == true) {
                btn.dataset.fav = false;
                form = document.querySelector(`[data-id="${json._id}"] input`).value = "false"
            }
            else if (json.favourite == false) {
                btn.dataset.fav = true;
                form = document.querySelector(`[data-id="${json._id}"] input`).value = "true"
            }

        }).catch(err => {
            console.error(err);
        });

    }


    function filter_song_nav_genre(artists, albums) {
        var genre
        let nav = document.querySelectorAll('.asideR .nav')
        nav.forEach((a) => a.addEventListener('click', (event) => {

            console.log(genre)
            event.preventDefault();

            //filtra la tabella per genre
            filteredSong(event.target.href.split('songs')[1]);

            //mette gli artisti in asideR
            let asideR = document.querySelector(".asideR");
            asideR.innerHTML = '';
            asideR.innerHTML = ejs.views_includes_asideR({ value: artists, field: "artist" })

            genre = event.target.href.split('songs')[1];
            genre = genre.split("=")[1]
            document.location.hash = "#songs/genre/" + genre;

            filter_song_nav_album(albums)

        }))
    }

    function filter_song_nav_album(albums) {
        var artist;
        let nav = document.querySelectorAll('.asideR .nav')
        nav.forEach((a) => a.addEventListener('click', (event) => {

            event.preventDefault();

            //filtra la tabella per album
            filteredSong(event.target.href.split('songs')[1]);

            //mette gli album in asideR
            let asideR = document.querySelector(".asideR");
            asideR.innerHTML = '';
            asideR.innerHTML = ejs.views_includes_asideR({ value: albums, field: "album" })

            artist = event.target.href.split('songs')[1];
            artist = artist.split("=")[1]
            document.location.hash = "#songs/artist/" + artist;

            listener_album_nav();

        }))
    }

    function listener_album_nav() {
        var album;
        let nav = document.querySelectorAll('.asideR .nav')
        nav.forEach((a) => a.addEventListener('click', (event) => {

            event.preventDefault();

            //filtra la tabella per album
            filteredSong(event.target.href.split('songs')[1]);

            //mette gli album in asideR
            let asideR = document.querySelector(".asideR");
            asideR.innerHTML = '';
            asideR.innerHTML = ejs.views_includes_asideR({ value: albums, field: "album" })

            album = event.target.href.split('songs')[1];
            album = album.split("=")[1]
            document.location.hash = "#songs/album/" + album;

            listener_album_nav();

        }))
    }


    function filter_song_listener() {
        let input = document.getElementById('search_bar')
        input.addEventListener('input', (event) => {
            event.preventDefault();
            console.log(input.value)

            filteredSong('?search=' + input.value);
            document.location.hash = "#songs/search/" + input.value;
        })
    }

    function filteredSong(filter) {
        fetch('/songs/' + filter, { headers: { 'Accept': 'application/json' } })
            .then((result) => {
                console.log(result.status)
                return result.json()
            })
            .then((songs) => {

                var songsList = {
                    songs_data: songs
                }

                let htmlMusic = ejs.views_songs_table(songsList);

                let song = songs[0];
                clear_main()
                let asideL = document.querySelector(".contain .asideL");
                asideL.insertAdjacentHTML("afterend", htmlMusic);

                delete_song()
                edit_song()
                song_play()

                // document.location.hash = "#songs";

            }).catch(err => {
                console.error(err);
            });
    }





    function delete_song() {
        let btns_delete = document.querySelectorAll(".delete");
        for (let i = 0; i < btns_delete.length; i++) {
            btns_delete[i].addEventListener("click", click_delete)
        }
    }

    function click_delete(e) {

        console.log("Delete clicked")
        let id = e.target.dataset.id

        console.log("id canzone da cancellare" + id)

        let container = e.target.parentNode.parentNode;
        console.log(container)

        fetch("/songs/" + id,
            {
                method: "DELETE",
                headers: { "Accept": "application/json" }
            })
            .then(res => {
                console.log(res.status);

                var src = e.target.parentNode.dataset.src

                container.removeChild(e.target.parentNode);


                var obj = JSON.parse(localStorage.getItem('pl'));
                var index = obj.songs.indexOf(src);
                obj.songs.splice(index, 1);
                playlist = new Playlist(obj.songs, obj.repeat)
                localStorage.setItem("pl", playlist.toJSON());


                var asideR = document.querySelector('.asideR');
                asideR.innerHTML = playlist.toHTML();

                console.log(playlist.songs)

            })


            .catch(err => {
                console.error(err);
            });
    }



    function edit_song() {
        let btns_edit = document.querySelectorAll(".edit");
        for (var i = 0; i < btns_edit.length; i++) {
            btns_edit[i].addEventListener("click", click_edit);
        }
    }

    function click_edit(e) {

        console.log("Edit clicked");
        e.preventDefault();  // stop the browser redirect 

        let url = new URL(e.currentTarget.href); //take the url from the DOMelement


        if (url.pathname.includes("/songs")) {
            console.log(url + "\n" + url.pathname)
            fetch(url.pathname,
                {
                    headers: {
                        "Accept": "application/json"
                    }
                })
                .then(
                    (res) => {
                        return res.json();
                    })
                .then(
                    (song) => {
                        console.log(song)
                        let htmlEdit = ejs.views_edit({ song: song });

                        let asideL = document.querySelector(".contain .asideL");

                        clear_main();

                        asideL.insertAdjacentHTML("afterend", htmlEdit);
                        document.location.hash = "#edit/" + song._id;

                        let form = document.querySelector(".forms")
                        form.addEventListener("submit",
                            (event) => {

                                event.preventDefault();
                                let body = new FormData(form);

                                fetch(`/songs/${song._id}`,
                                    {
                                        method: "PUT",
                                        body
                                    })

                                    .then(
                                        (res) => {
                                            return res.json();
                                        })
                                    .then(
                                        (song) => {
                                            console.log("The song has been uploaded")
                                            console.log(song);
                                            socket.emit('updateSong', song.src, song.title);
                                        })
                                    .then(
                                        () => {
                                            generate_table();
                                        })
                            })
                    })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    function aside_filter() {
        console.log("filter asideR")
        let btns_filter = document.querySelectorAll(".asideR .nav")
        for (let i = 0; i < btns_filter.length; i++) {
            btns_filter[i].addEventListener("click", click_filter)
            console.log(btns_filter[i])
        }
    }

    function click_filter(e) {

        e.preventDefault();
        let url = new URL(e.currentTarget.href)

        if (url.includes('/songs')) {
            fetch(url.pathname,
                {
                    headers: { "Accept": "application/json" }
                }).then(response => {
                    return response.json();
                })
                .then(
                    (songs) => {
                        var songsList = {
                            songs_data: songs
                        }

                        let htmlMusic = ejs.views_songs_table(songsList);
                        let asideL = document.querySelector(".contain .asideL");

                        clear_main();    // remove main 

                        asideL.insertAdjacentHTML("afterend", htmlMusic);
                        document.location.hash = "#songs-genre";

                    }).catch(err => {
                        console.error(err);
                    });
        }
    }



    function song_play() {
        let btn_play = document.querySelectorAll(".btn_play");
        for (let i = 0; i < btn_play.length; i++) {
            btn_play[i].addEventListener("click", click_play);
        }
    }

    function click_play(e) {
        console.log("click_play")

        e.preventDefault();
        let url = new URL(e.currentTarget.href)


        fetch(url.pathname,
            {
                headers: { "Accept": "application/json" }
            })
            .then(
                (res) => {
                    return res.json();
                })
            .then(
                (song) => {

                    console.log(song);

                    let audio = document.querySelector('#player-audio')

                    let src = [song.src]

                    init_player(audio, src, true)


                }).catch(err => {
                    console.error(err);
                });
    }



    //         --------------- Exercise 8 - Socket -----------------------



    socket.on('connect', () => {
        console.log("Browser connected")
        console.log("ID socket: " + socket.id);

        onconnect();
    })

    socket.on('message', (msg) => {

        console.log(msg);
    })

    socket.on('disconnect', () => {
        console.log("Browser disconnected")
        onDisconnect();
    })

    socket.on('order', (e) => {
        console.log("You are the " + e + "client")
    })

    // newSong socket event 
        socket.on('newSong', () => {

            console.log("[+] New song added: ");

            let url = new URL(window.location.href)

            console.log("[#] Your current hash is: ", url.hash)

            if (url.hash == "#songs")
                generate_table();
        })


    function isInplaylistAudioSrc(src) {

        var audio = document.querySelector("main #player-audio");

        var obj = JSON.parse(localStorage.getItem('pl'));
        var index = obj.songs.indexOf(src);
        obj.songs.splice(index, 1);
        var playlist = new Playlist(obj.songs, obj.repeat)
        localStorage.setItem("pl", playlist.toJSON());


        var asideR = document.querySelector('.asideR');
        asideR.innerHTML = playlist.toHTML();

        if (audio.src.split('8888/')[1] == src)
            init_player_with_playlist(document.querySelector('main'), "pl");

    }





    socket.on('updateSong', (src, title) => {
        console.log("[+=] Update song")

        let url = new URL(window.location.href);

        var audio = document.querySelector(".player-footer")
        var audioPlaylist = document.querySelector("main #player-audio")

        if (url.hash == "#songs")
            generate_table();

        if (url.hash == '#player') {
            if (audioPlaylist.src == src)
                document.querySelector("main #nameSong").innerHTML = title;
        }

        if (audio.src.split("8888/")[1] == src)
            document.querySelector("footer #nameSong").innerHTML = title;

        console.log("[EDIT SONG]")
        console.log(audio.src.split("8888/")[1] == src)
        console.log(audio.src.split("8888/")[1] + "  \n" + src)
        console.log(title)
    })



    socket.on('deleteSong', (msg) => {
        console.log("[-] Delete song");

        let url = new URL(window.location.href)

        console.log(url.hash);
        var obj = JSON.parse(localStorage.getItem('pl'));
        var audio = document.querySelector(".player-footer")

        console.log("[delete - audio]" + audio.src)
        console.log("[delete - MSG]" + msg.src)

        if (url.hash == "#songs") {
            generate_table();
        }
        else if (url.hash == "#player") {
            // controlla se la canzone e in esecuzione nel player se si stoppalo e rimuovi l'src
            isInplaylistAudioSrc(msg.src)
            console.log("cancellata nel player: " + msg.src)
        }
        else if (url.hash == `#edit/${msg.id}`) {
            generate_table();
        }

        if (audio.src.split('8888/')[1] == msg.src || audio.src == msg.src) {
            console.log("[remove song to player]")

            if (obj.songs.includes("music/")) {
                document.querySelector("#nameSong").innerHTML = obj.songs[0].split("music/")[1];
                audio.src = obj.songs[0];
            } else {
                document.querySelector("#nameSong").innerHTML = "";
                audio.src = "";
            }
        }
    })

    socket.on('updateLocalStorage', (src) => {
        console.log("[SRC]: " + src);
        var asideR = document.querySelector('.asideR');
        var playlist;
        if (localStorage.length != 0 || localStorage.getItem("pl") != null) {
            var playlistSongs = JSON.parse(localStorage.getItem("pl"));
            playlistSongs = playlistSongs["songs"];
            playlist = new Playlist(playlistSongs);
        } else {
            playlist = new Playlist();
            localStorage.setItem("pl", playlist.toJSON())
        }


        if (playlist.songs.includes(src)) {
            var index = playlist.songs.indexOf(src)
            playlist.songs.splice(index, 1)
            localStorage.setItem("pl", playlist.toJSON());
        } else {
            playlist.appendSong(src);
            localStorage.setItem("pl", playlist.toJSON());
        }
        asideR.innerHTML = playlist.toHTML();
        document.querySelectorAll(".asideR .navR").forEach((x) => {
            x.addEventListener("click", function (event) {

                event.preventDefault();

                document.querySelector('.contain main #player-audio').src = x.children[0].href;
                document.querySelector('.contain main #nameSong').innerHTML = x.children[0].href.split('music/')[1];
            })
        })

    })

    socket.on('next', () => {

        let url = new URL(window.location.href)

        if (url.hash == "#songs" || url.hash == "#index" || url.hash == "#upload" || url.hash == "#player") {
            var audio = document.querySelector('.player-footer')

            if (localStorage.length != 0 && localStorage.getItem('pl') != null) {
                var pl = JSON.parse(localStorage.getItem('pl'))
                playlistS = pl['songs']
                var playlist = new Playlist(playlist)
                audio.src = playlistS[0];
                document.querySelector("footer #nameSong").innerHTML = playlistS[0].split('music/')[1]

            }
            else {
                var playlist = new PLaylist();
                localStorage.setItem('pl', playlist.toJSON());
            }
        }

    })

    socket.on('play', () => {
        let url = new URL(window.location.href)
        if (url.hash == "#songs" || url.hash == "#index" || url.hash == "#upload" || url.hash == "#player")
            document.querySelector("#play").click();
    })

    socket.on('pause', () => {
        let url = new URL(window.location.href)
        if (url.hash == "#songs" || url.hash == "#player" || url.hash == "#index" || url.hash == "#upload")
            document.querySelector("#pause").click();
    })

    socket.on("counter", (counter) => {
        console.log("Clients Conneted" + counter)
    })



    function onconnect() {
        let soundHub = document.querySelector('header h1')
        soundHub.classList.add("ok")
    }
    function onDisconnect() {
        let soundHub = document.querySelector('header h1')
        soundHub.classList.remove("ok")
    }



}