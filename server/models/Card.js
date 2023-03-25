const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

//to store our instances of cards
const cardSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    upright: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    }
});

const Card = model("Card", cardSchema);

module.exports = Card;