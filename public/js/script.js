/**
 * Web Atelier 2021 3 - Object-Oriented JavaScript
 *
 * Student: __Gualandris Andrea__
 *
 */

/* *************************************************************** */
/* ** REPLACE THIS FILE WITH YOUR OWN script.js FROM EXERCISE 2 ** */
/* *************************************************************** */

//--------------------------------------------------------------------------------------
// Task 1
//--------------------------------------------------------------------------------------

/**
* @param {number} s - A time as the number of seconds.
* @return {string} A string which represents the number of minutes followed by the remaining seconds
*  with the M:SS format. If the input value is negative, the resulting string should be in -M:SS format.
* SS indicates that if the number of seconds is less than 10, it should be padded with a 0 character.
*/

function format_seconds(s) {
    var sec = 0;
    var calc = 0, min = 0;


    if (s == undefined || isNaN(s) == true || s === "" || Array.isArray(s)) {
        return "?:??";
    }
    if (s == 0) {
        return "0:00";
    }

    if (s % 1 != 0) {
        let temp = s.toString().split(".");
        s = temp[0];
    }
    calc = s / 60;

    if (calc % 1 != 0) {
        let temp2 = calc.toString().split(".");
        min = temp2[0];
        var calcoloS = 60 * min;
        sec = s - calcoloS;
        if (s < 0) {
            if (sec > -10)
                return min + ":0" + (sec * -1);
            else
                return min + ":" + (sec * -1);
        }
        if (sec < 10)
            return min + ":0" + sec;

        return min + ":" + sec;
    }
    else {
        min = calc;
        return min + ":00";
    }
}




/**
* @param {number[]} a - The array of numbers.
* @param {number} c - The scalar multiplier.
* @return {number[]} An array computed by multiplying each element of the input array `a`
* with the input scalar value `c`.
*/
function scalar_product(a, c) {
    var b = [];
    if (a != undefined && Array.isArray(a) && c != undefined) {
        if (a.length == 0)
            return b;

        if (a.length > 0) {
            if (c == 1) {
                return a;
            }
            else {
                for (let j = 0; j < a.length; j++) {
                    b[j] = a[j] * c;
                }
                return b;
            }
        }
    } else { return undefined; }
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number} A value computed by summing the products of each pair
 * of elements of its input arrays `a`, `b` in the same position.
 */
function inner_product(a, b) {
    var somma = 0;
    if ((!Array.isArray(a)) || (!Array.isArray(b))) { return undefined; }
    if (a.length == b.length) {
        for (var i = 0; i < a.length; i++) {
            somma = somma + a[i] * b[i];
        }
        return somma;
    }
    else { return undefined; }
}


/**
 * @param {array} a - The array.
 * @param {function} mapfn - The function for the map step.
 * @param {function} [reducefn= function(x,y) { return x+y; }] - The
 * function for the reduce step.
 * @param {string} [seed=""] - The accumulator for the reduce step.
 * @return {*} The reduced value after the map and reduce steps.
 */

function mapReduce(a, mapfn, reducefn = (a, c) => a + c, seed = "") {

    if (typeof reducefn !== 'function' || !(mapfn instanceof Function)) {
        return undefined;
    }
    if (Array.isArray(a)) {
        if (reducefn == undefined) {
            var a1 = a.map(mapfn);
            var a2 = a1.reduce(a1);
            return a2;
        } else {
            var a1 = a.map(mapfn);
            var a2 = a1.reduce(reducefn, seed);
            return a2;
        }
    }
}


/**
* @param {integer} x - The first integer.
* @param {integer} y - The second integer.
* @param {integer} [step=1] - The value to add at each step.
* @return {integer[]} An array containing numbers x, x+step, … last, where:
*    - last equals x + n*step for some n,
*    - last <= y < last + step if step > 0 and
*    - last + step < y <= last if step < 0.
*/
function range(x, y, step = 1) {
    var a = [];
    if (step === 0)
        return;
    if (!Number.isInteger(x)
        || !Number.isInteger(y)
        || !Number.isInteger(step))
        return undefined;

    var lung = (y - x) / step;

    for (let i = 0; i <= lung; i++) {
        if (i == 0)
            a[i] = x;
        else
            a[i] = a[i - 1] + step;
    }
    return a;
}




/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number[]} An array with the elements found both in `a` and `b`.
 */
function array_intersect(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return undefined;
    var count = 0;
    var result = [];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            if (a[i] == b[j]) {
                result[count] = a[i];
                count++;
            }
        }
    } return result;
}


/**
 * @param {number[]} a - The first array of numbers.
 * @param {number[]} b - The second array of numbers.
 * @return {number[]} An array with the elements found in `a` but not in `b`.
 */

function array_difference(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b))
        return;

    //return a.filter(a => !b.includes(a))
    return a.filter((x) => { return b.indexOf(x) == -1 });
}



//--------------------------------------------------------------------------------------
// Task 2
//--------------------------------------------------------------------------------------

/**
 * @param {number[]} a - The array over which to iterate.
 * @return {function} - call this function to retrieve the next element of the array. The function throws an error if called again after it reaches the last element.
 */

function iterator(a) {

    var index = 0;

    if (!Array.isArray(a))
        return undefined;

    return function next(b) {

        if (Array.isArray(b)) {
            index = 0;
            a = b;
            return b[index];
        }
        else if (b !== undefined) {
            if (b === 0) {
                index = 0;
                return 0;
            }
            else {
                index = index + b;
                return a[index];
            }
        }
        else if (b === undefined) {
            if (index < a.length)
                return a[index++];
            else
                throw 'eccezione';

        }
    }
}


//--------------------------------------------------------------------------------------
// Task 3
//--------------------------------------------------------------------------------------

/**
 * @param {dom} dom_audio - Reference to the `<audio>` element.
 * @param {URL[]} song_urls - An Array of song URLs, whose values can be passed to the <audio src> attribute.
 * @param {Boolean} volume - If true (default), initialize and show the volume control buttons.
 * @return {function} A function which can be called with a new `song_urls` Array to replace the current playlist.
 */

function init_player(dom_audio, song_urls, volume = true) {
    let buttonPlay = document.getElementById("play");
    let pauseButton = document.getElementById("pause");
    let title = document.getElementById("nameSong");
    let nextButton = document.getElementById("next");
    let prevButton = document.getElementById("prev");
    let muteButton = document.getElementById("mute");
    let lowButton = document.getElementById("low");
    let loudButton = document.getElementById("loud");
    let range = document.getElementById("volumerange");
    let elapsed = document.getElementById("elapsed");
    let remain = document.getElementById("remain");
    let progress = document.getElementById("timeProg");
    let image = document.getElementById("imagePlayer");
    var vol = 50;
    var isPlaying = false;
    var url = new URL(window.location);
    var searchParam = new URLSearchParams(url.search);
    var index = 0;

    var params = url.searchParams
    var address = params.get("src");

    if (address != null) {
        for (var i = 0; i < song_urls.length; i++) {
            if (song_urls[i] == address) {
                index = i;
            }
        }
        load_audio(index);
    }




    // pauseAudio()
    load_audio(index);
    controlla(volume);
    function controlla(volume) {
        if (volume == false) {
            muteButton.style.display = 'none';
            lowButton.style.display = 'none';
            loudButton.style.display = 'none';
            range.style.display = 'none';
        }

    }



    function load_audio(index) {
        if (index < song_urls.length) {
            var src = params.get("src")
            searchParam.append('src=', song_urls[index]);
            console.log(searchParam.entries())
            var pair;
            for (pair of searchParam.entries()) {
                console.log(pair[0] + pair[1]);
            }
            if (src != null)
                pair[1] = src;
            console.log(pair[1] + ' ultimo')
            var tit = pair[1].split("/");
            title.innerHTML = tit[2];
            dom_audio.src = pair[1];
            src = null;

            //   durata(dom_audio);
            tempo(dom_audio);
            currentTime(dom_audio);
            changeImg();
        }
        else {
            index = 0;
            console.log(song_urls)
            var tit = song_urls[index].split("/");
            title.innerHTML = tit[1];
            dom_audio.src = song_urls[index];
            //       durata(dom_audio);
            tempo(dom_audio);
        }


    }

    function changeImg() {
        image.src = "images/" + index + ".jpg";
    }

    if (!window.location.pathname.includes('/playlist.html')) {
        prevButton.addEventListener("click",
            function prevAudio() {
                if (index > 0) {
                    index--;
                    load_audio(index);
                    if (isPlaying)
                        dom_audio.play();
                }
                else {
                    index = song_urls.length - 1;
                    load_audio(index);
                }
                changeImg();
            });
    }

    if (!window.location.pathname.includes('/playlist.html')) {
        nextButton.addEventListener("click",
            function nextAudio() {
                if (index < song_urls.length - 1) {
                    //  aggiungiUrl(song_urls[index]);
                    index++;
                    load_audio(index);

                    if (isPlaying) {
                        dom_audio.play();
                    }
                } else {
                    index = 0;
                    load_audio(index);

                    changeImg();
                }

            });
    }

    function playAudio() {
        isPlaying = true;
        dom_audio.play();
        //      console.log(dom_audio.duration); //mostra la durata in secondi
        dom_audio.ontimeupdate = function (e) {
            progress.max = dom_audio.duration;
            progress.value = dom_audio.currentTime;
            currentTime(dom_audio);
            tempo(dom_audio);
        }
    }
    buttonPlay.addEventListener("click", playAudio);

       

    function tempo(audio) {
        let audioDurate;
        setTimeout(function () { //aspetta 100 milisec altimenti non restituisce durata
            audioDurate = audio.duration;

            let d = format_seconds(audioDurate);
            if (d == undefined || d == "?:??") {
                remain.innerHTML = "0:00";
                elapsed.innerHTML = "0:00"
            }
            else
                remain.innerHTML = d;
        }, 100);


    }

    function currentTime(audio) {

        let d = format_seconds(audio.currentTime);
        if (d == undefined || audio.duration < 1 || d == "?:??") {
            elapsed.innerHTML = "0:00";
        }
        else {
            elapsed.innerHTML = d;
            if (window.location.pathname == '/playlist.html') {
                var playlistSongs = JSON.parse(localStorage.playlist);
                playlistSongs = playlistSongs["songs"];
                var pl = new Playlist(playlistSongs);
                asideR.innerHTML = pl.toHTML();
            }

        }
    }

    pauseButton.addEventListener("click", function p() { pauseAudio(); });

    function pauseAudio() {
        isPlaying = false;
        dom_audio.pause();
        currentTime(dom_audio);
        tempo(dom_audio);
    }

    muteButton.addEventListener("click",
        function volumeMute() {
            vol = 0;
            dom_audio.volume = vol;
            range.value = vol;
        });

    lowButton.addEventListener("click",
        function volumeDown() {
            if (vol == 0) {
                dom_audio.volume = vol;
                range.value = vol;
            }
            else {
                if (vol > 0 && vol < 20) {
                    vol = 0;
                    range.value = 0;
                    dom_audio.volume = 0;

                }
                else if (vol >= 20) {
                    dom_audio.volume = vol / 100 - 0.2;
                    vol -= 20;
                    range.value = vol;
                }
            }
        });

    loudButton.addEventListener("click",
        function volumeUp() {
            if (vol >= 80) {
                vol = 100;
                dom_audio.volume = 1;
                range.value = vol;
            }
            else {
                vol += 20;
                dom_audio.volume = vol / 100 + 0.2;
                range.value = vol;
            }
        });

    range.addEventListener("change", function (e) {
        vol = e.currentTarget.value;
        dom_audio.volume = vol / 100;

    });

   
    /* var ev = new CustomEvent ("newEvent",{   
       detail: {song: "you are listening a song"}
   });
 
   buttonPlay.addEventListener("click", (e)=>{
       buttonPlay.dispatchEvent(ev)
       console.log(ev.detail)
   }) */


}

//--------------------------------------------------------------------------------------
// Task 4
//--------------------------------------------------------------------------------------

/**
 * @param {String} text - The mini markdown text string.
 * @return {String} The corresponding HTML representation.
 */
function mini_md(text) {
}