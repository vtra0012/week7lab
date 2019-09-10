let mongoose = require('mongoose');
let express = require('express');
let app = express();

let bodyParser=require('body-parser'); //needed as the middleware for the post request
app.use(bodyParser.urlencoded({extended:false}));

let Developer = require('./models/developer'); //Referencing to model, not schema - Nawfal
let Task = require('./models/task');

app.use(express.static(__dirname+"/views"));
app.use(express.static(__dirname+"/img"));

let url = "mongodb://localhost:27017/week6lab";


mongoose.connect(url, function(err){
    if (err)
        console.log(err);
    else{
        console.log('Connected!!');
    }
        
});

// GET - ADD NEW DEVELOPER 
app.get('/',function(req,res){
    res.sendFile(__dirname + "/views/adddev.html");
    
}); 

// POST - ADD NEW DEVELOPER
app.post('/addnewdev', function(req,res){
    let devDetails = req.body;

    let developer = new Developer({
            name: { fname: devDetails.dfname ,
                    lname: devDetails.dlname
                  },

            level: devDetails.dlevel,
            
            address: {
                state: "" + devDetails.dstate,
                suburb: "" + devDetails.dsuburb,
                street: "" + devDetails.dstreet,
                unit: "" + parseInt(devDetails.dunit)
            }
        });

        developer.save(function(err){
            if (err)
                console.log(err);
            else
                console.log('Dev Saved');
                res.redirect('/getdevelopers');
                
                
        })
})

//GET - LIST ALL DEVELOPERS
app.get('/getdevelopers', function(req,res){
    Developer.find().populate('developer').sort({_id:1}).exec(function(err, data){
        res.render(__dirname + "/views/getdevs.html", { devDb: data });
    })
    
}); 

// GET - ADD TASK
app.get('/addtask',function(req,res){
    res.sendFile(__dirname + "/views/addtask.html");
}); 

// POST - ADD TASK
app.post('/addnewtask', function(req,res){
    let taskDetails = req.body;
    let task = new Task({
            name: taskDetails.tname,
            assign: taskDetails.tdevid,
            due: taskDetails.tdate,
            status: taskDetails.tstatus,
            desc: taskDetails.tdesc
        });

        task.save(function(err){
            if (err)
                console.log(err);
            else
                console.log('Task Saved');
                res.redirect('/gettasks');
                   
        })
})

// GET - ALL TASKS, using find() bc retrieves all object from collection - Nawfal
app.get('/gettasks', function(req,res){
    Task.find().populate('task').exec(function(err, data){ //data parameter will be retrieved in an array format
        
        res.render(__dirname + "/views/gettasks.html", { taskDb: data });
    })
    
}); 

// GET - DELETE TASK
app.get('/deletetask', function (req, res) {
    res.sendFile(__dirname + '/views/deletetask.html');
});

// POST - DELETE TASK
app.post('/deletetaskdata', function (req, res) {
    Task.findByIdAndRemove(req.body.tid, function(err, result){
        if (err)
            console.log(err);
    });
    res.redirect('/gettasks');// redirect the client to list users page
});

// GET UPDATE TASK
app.get('/updatetask', function (req, res) {
    res.sendFile(__dirname + '/views/updatetask.html');
});

// POST UPDATE DATA
app.post('/updatetaskdata', function (req, res) {
    let taskDetails = req.body;
    let filter = taskDetails.tid;
    let theUpdate = { $set: { status:taskDetails.tstatus} };
    Task.findByIdAndUpdate(filter, theUpdate, function(err, result){
        if (err)
            console.log(err);
    });
    res.redirect('/gettasks');// redirect the client to list users page
});

// =============EXTRA TASK=========================

// GET - DELETE COMPLETED TASK
app.get('/deletecomplete', function (req, res) {
    res.sendFile(__dirname + '/views/deletecomplete.html');
});


// POST - DELETE COMPLETED TASK
app.post('/deletecompletedata', function (req, res) {
    let filter = { status: "Complete" };
    Task.deleteMany(filter, function(err, result){
        if (err)
            console.log(err);
    });
    res.redirect('/gettasks');// redirect the client to list users page
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(8000);
