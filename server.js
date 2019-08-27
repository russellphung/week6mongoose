let express = require('express');
let app = express();
var db = [];

//set up view engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
    res.render("tasks.html", {myData:db});
});

app.post("/addTask", function(req, res){
    db.push(req.body);
    res.render("tasks.html", {myData:db});
});

app.listen(8000);

