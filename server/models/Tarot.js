const { Schema, model } = require("mongoose");

//to store our card meaning
const tarotSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    upright: {
        type: String,
        required: true,
    },
    inverted: {
        type: String,
        required: true,
    },
    suit: {
        type: String,
    },
});

const Tarot = model("Tarot", tarotSchema);

module.exports = Tarot;