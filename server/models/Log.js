//mongoose model schema
const { Schema, model } = require('mongoose');
//get date to store when the reading was processed
const dateFormat = require("../utils/dateFormat");


//reading logs model schema
const logSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
    question: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 280,
    },
    //as a array just in case we do more than 1 card spread later
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Card"
        }
    ],
    //notes not required, but can be saved after card has been generated
    note: {
        type: String,
        minlength: 1,
        maxlength: 3000,
    },

});

//create model using schema

const Log = model("Log", logSchema);

module.exports = Log;