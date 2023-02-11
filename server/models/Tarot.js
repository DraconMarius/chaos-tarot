const { Schema, model } = require("mongoose");

//to store our card meaning
const tarotSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    suit: {
        type: String,
    },
    upright: {
        type: String,
        required: true,
    },
    inverse: {
        type: String,
        required: true,
    },
});

const Tarot = model("Tarot", tarotSchema);

module.exports = Tarot;