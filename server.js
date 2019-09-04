let express = require('express');
let app = express();

const morgan = require('morgan');
app.use(morgan('common'));

var db;

//mongoDB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://'+ process.argv[2] + ":27017/";
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
app.post("/addTask", function(req, res){
    let taskDetails = req.body;
    db.collection('Tasks').insertOne({
        taskName: taskDetails.taskName,
        taskAssigned: taskDetails.taskAssigned,
        taskDate: new Date(taskDetails.taskDate),
        taskStatus: taskDetails.taskStatus,
        taskDescription: taskDetails.taskDescription
    }) 
    res.redirect('/listTasks');
});

app.get("/listTasks", function(req, res){
    db.collection('Tasks').find({}).toArray(function(err, data){
        if(err){
            console.log('err: ', err);
        }
        else {
            res.render("listTasks.html", {myData:data});

        }
    })
});

app.get("/deleteTask", function(req, res){
    let filename = filePath + "deleteTask.html";
    res.sendFile(filename);
});
app.post("/deleteTask", function(req, res){
    let taskID = req.body.taskID;
    console.log(taskID);
    db.collection('Tasks').deleteOne({_id: new mongodb.ObjectID(taskID)},function(err, obj){}) 
    res.redirect('/listTasks');
});

app.get("/deleteAll", function(req, res){
    let filename = filePath + "deleteAll.html";
    res.sendFile(filename);
});
app.post("/deleteAll", function(req, res){
    db.collection('Tasks').deleteMany({}) 
    res.redirect('/listTasks');
});

app.get("/updateTask", function(req, res){
    let filename = filePath + "updateTask.html";
    res.sendFile(filename);
});
app.post("/updateTask", function(req, res){
    let taskDetails = req.body;
    db.collection('Tasks').updateOne({_id: new mongodb.ObjectID(taskDetails.taskID)},
    {$set:{taskStatus:taskDetails.taskStatus}}, function(err, obj){}) 
    res.redirect('/listTasks');
});

app.get("/deleteOldComplete", function(req, res){
    let filename = filePath + "deleteOldComplete.html";
    res.sendFile(filename);
});
app.post("/deleteOldComplete", function(req, res){
    let due = new Date(req.body.dueDate);
    db.collection('Tasks').deleteMany({$and:[{taskStatus: 'complete'},{taskDate:{$lte:due = new Date()}}]});
    //db.collection('Tasks').deleteMany({taskDate:{$lte:new Date(req.body.dueDate)}});
    console.log(due);
    res.redirect('/listTasks');
});

app.listen(8000);

