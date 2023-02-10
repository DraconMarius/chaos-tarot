const { Schema, model } = require("mongoose");

//to store our card meaning
const cardSchema = new Schema({
    Name: {
        type: String,
        require: true,
        unique: true,
    },
    Suit: {
        type: String,
    },
    Meaning: {
        type: String,
        required: true,
    },

});

const Card = model("Card", cardSchema);

module.exports = Card;