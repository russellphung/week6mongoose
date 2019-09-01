let express = require('express');
let app = express();

const morgan = require('morgan');
app.use(morgan('common'));

var db;

//mongoDB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('Week5ToDoList');
    }
});

//set up view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// let bodyParser = require('body-parser');
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('img'));
app.use(express.static('css'));

var filePath = __dirname + "/views/";

app.get("/", function(req, res){
    let filename = filePath + "index.html";
    res.sendFile(filename);
});

app.get("/addTasks", function(req, res){
    let filename = filePath + "addTasks.html";
    res.sendFile(filename);
});

app.get("/listTasks", function(req, res){
    res.render("listTasks.html", {myData:db});
});

app.post("/addTask", function(req, res){
    let taskDetails = req.body;
    db.collection('Tasks').insertOne({
        taskName: taskDetails.taskName,
        taskAssigned: taskDetails.taskAssigned,
        taskDate: taskDetails.taskDate,
        taskStatus: taskDetails.taskStatus,
        taskDescription: taskDetails.taskDescription
    }) 
    
    //res.render("listTasks.html", {myData:db});
    let filename = filePath + "index.html";
    res.sendFile(filename);
});

app.listen(8000);

