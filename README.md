# SoundHub

SoundHub is a web-based music player application that allows users to upload, manage, and play their favorite songs. It's built with Node.js, Express.js, EJS for server-side rendering, and MongoDB for data storage. The application also uses AJAX for asynchronous data fetching and manipulation.

## Technologies Used

- Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine. It's used for building fast and scalable network applications.
- Express.js: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- EJS: A simple templating language that lets you generate HTML markup with plain JavaScript.
- MongoDB: A source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.
- AJAX: A set of web development techniques using many web technologies on the client-side to create asynchronous web applications.

## Project Structure

- `public/`: This directory contains all the static files like CSS, JavaScript, music folder and HTML files.
- `routes/`: This directory contains all the route handlers for the application.
- `views/`: This directory contains all the EJS templates for the application.
- `models/`: This directory contains the MongoDB connection and model definitions.
- `ws.js`: This file contains the WebSocket server implementation.
- `app.js`: This is the main entry point of the application.
- `functions.js`: This file contains utility functions used throughout the application.
- `metadata.js`: This file is responsible for handling the metadata of the songs.

## How to Run the Project

1. Clone the repository: `git clone https://github.com/AndreaGualandris/SoundHub.git`
2. Navigate into the project directory: `cd SoundHub`
3. Install the dependencies: `npm install`
4. Start the MongoDB server: `mongod`
5. Start the server: `node app.js`
6. Open your web browser and visit `http://localhost:8888`

Please note that you need to have Node.js, npm, and MongoDB installed on your machine to run this project.
