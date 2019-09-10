//separation of concerns, increase security
//increasing flexibility of data
//schema is a blueprint

let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({

    name:{
        
        fname:{
        type: String,
        required:true
        },

        lname:String
    },

    level:{
        type: String,
        required:true,
        validate:{
            validator: function(value){
                if (value === "BEGINNER" || value === "EXPERT")
                    return true;
                else 
                    return false;
            },
            message: 'Must be BEGINNER or EXPERT'
        }
    },

    address: {
        state:String,
        suburb: String,
        street: String,
        unit: Number
    }

    
});

//Model should be saved in the collection - Nawfal
let developerModel = mongoose.model("developerCollection", developerSchema);

module.exports = developerModel;