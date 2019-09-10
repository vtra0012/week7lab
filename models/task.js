let mongoose = require('mongoose');


let taskSchema = mongoose.Schema({

    name: String,
    assign:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'developerCollection'
    },
    due: Date,
    status:{
        type: String,
        validate:{
            validator: function(value){
                if (value === "InProgress" || value === "Complete")
                    return true;
                else 
                    return false;
            },
            message: 'Must be InProgress or Complete'
        }
    },
    desc:String

});

let taskModel = mongoose.model("taskCollection", taskSchema);

module.exports = taskModel;