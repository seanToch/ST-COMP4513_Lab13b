const path = require('path');
const express = require('express');

// create an express app
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle requests for static resources
app.use('/static', express.static(path.join(__dirname,'public')));
app.use('/socket.io', express.static(path.join(__dirname,  
'/node_modules/socket.io/client-dist/'))); 

const upload = require('./scripts/uploader.js'); 
// Set up a route for file uploads 
app.post('/uploader', upload.single('fileElem'), (req, res) => { 
  // Handle the uploaded file 
res.json({ message: 'File uploaded successfully!' }); 
});

// set up route handling
const router = require('./scripts/stock-router.js');
router.handleAllStocks(app);
router.handleSingleSymbol(app);
router.handleNameSearch(app);
router.handleCurlTest(app);
            
// listen for socket communication on port 3000 
const { Server } = require('socket.io');

const io = new Server(3000, {
    cors: {
        origin: 'https://studious-space-enigma-gwpqv6jvqgpcv597-8080.app.github.dev',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('username', msg => { 
console.log('username: ' + msg); 
        // attach passed username with this communication socket 
socket.username = msg; 
        // broadcast message to all connected clients 
const obj = { message: "Has joined", user: msg }; 
socket.broadcast.emit('user joined', obj);
});  

socket.on('chat from client', msg => { 
console.log('message received from ' + socket.username); 
io.emit('chat from server',  
{ user: socket.username, message: msg } ); 
}); 
});

io.engine.on('connection_error', (err) => {
    console.log('Socket.IO connection error:', err.message);
});


// Use express to listen to port
let port = process.env.PORT;
app.listen(port, () => {
    console.log("Server running at port= " + port);
    console.log("Static File Test 1: https://localhost:8080/static/tester.html");
    console.log("Static File Test 2: https://localhost:8080/static/uploader.html");
    console.log("API Test 1: https://localhost:8080/stock/");
    console.log("API Test 2: https://localhost:8080/stock/amzn");
    console.log("API Test 3: https://localhost:8080/stock/name/alph");
});

