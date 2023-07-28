const io = require('socket.io')();

const EventEmitter = require('events');
const eventBus = new EventEmitter();

function init_socket(server) {

    var counter=0;
    console.log('Starting ws server');

    //server to attach to
    io.attach(server);

    io.on('connection', (socket) => {

        console.log('[-ws-] Client connected');

        counter++;
        console.log("Clients connected: "+ counter)
        io.emit("counter", counter)

        socket.emit("order", counter);


        socket.emit('message', { user: 'Server', text: 'Connected' });

        socket.on('play', () => {
            console.log("[PLAY]")
            socket.broadcast.emit('play');
        })

        socket.on('pause', () => {
            console.log("[PAUSE]")
            socket.broadcast.emit('pause');
        })

        socket.on('next', ()=>{
            console.log("[NEXT]");
            socket.broadcast.emit('next')
        })

        socket.on('updateLocalStorage', (event) => {
            console.log("[OO][localStorage Event]")
            console.log(event)
            io.emit('updateLocalStorage', event)
        })
        socket.on('updateSong', (src, title) => {
            console.log("----[BUS]---- "  + "UPDATED")
            socket.broadcast.emit("updateSong", src, title);
        })

        socket.on('disconnect', () => {
            counter--;
            console.log('[-ws-] Client Disconnected')
        })


        //io.emit -->sending to all clients include sender 
    

        eventBus.on('newSong', () => {
            console.log("----[BUS]---- " +  "CREATED")
            io.emit("newSong" );
        })

        /*  eventBus.on('updateSong', (event) => {
            console.log("----[BUS]---- " + event + "UPDATED")
            console.log(event)
            io.emit("updateSong" + event);
        })  */

        eventBus.on('deleteSong', (event)=>{
            console.log("----[BUS]---- " + event + "DELETED");
            io.emit('deleteSong', event);
        })


    })

}

module.exports.init_socket = init_socket;
module.exports.eventBus = eventBus
