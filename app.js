/**
 * Web Atelier 2021  Exercise 6 - MongoDB
 *
 * Student: Andrea Gualandris
 *
 * Main Server Application
 *
 * version 1989 Thu Oct 28 2021 11:11:10 GMT+0200 (Central European Summer Time)
 *
 */

  /**
   * TODO: REPLACE WITH THE app.js FILE FROM YOUR PREVIOUS ASSIGNMENT
   */

    //require framework and middleware dependencies
    const express = require('express');
    const path = require('path');
    const logger = require('morgan');
    const methodOverride = require('method-override');
    const fileUpload = require('express-fileupload');
    const fs = require('fs-extra');

    require("./ejs-compile");

    //init framework
    const app = express();

    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }, safeFileNames: true, preserveExtension: 4, debug: false
      }));
    app.use(express.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
    app.use(express.json({limit: '4MB'}));    // parse application/json
    app.use(methodOverride('_method'));

    app.set('view engine', 'ejs');


    //controllers
    //this will automatically load all routers found in the routes folder
    const routers = require('./routes');

    app.use('/songs', routers.music);
    //app.use('/playlist', routers.playlist);

    app.use('/', routers.root);

    //default fallback handlers
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

      // error handlers

      // development error handler
      // will print stacktrace
      //if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.json({
            message: err.message,
            error: err
          });
        });
      //}

      // production error handler
      // no stacktraces leaked to user
      // app.use(function(err, req, res, next) {
      //   res.status(err.status || 500);
      //   res.json({
      //     message: err.message,
      //     error: {}
      //   });
      // });



    //start server
    app.set('port', process.env.PORT || 8888);

    var server = require('http').createServer(app);

    server.on('listening', function() {
      console.log('Express server listening on port ' + server.address().port);
    });

    server.listen(app.get('port'));


    const ws = require('./ws');
    ws.init_socket(server);
