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
    image: {
        type: String,
        require: true,
    },
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Card",
        }
    ],
    question: {
        type: String,
        require: true,
        minlength: 1,
        maxlength: 280,
    },
    //notes not required, but can be saved after card has been generated
    note: {
        type: String,
        minlength: 1,
        maxlength: 280,
    },

});

//create model using schema

const Log = model("Log", logSchema);

module.exports = Log;