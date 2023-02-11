//mongoose model schema
const { Schema, model } = require('mongoose');
//importin bcrypt for pw encrytion
const bcrypt = require('bcrypt');
const { StraightenSharp } = require('@mui/icons-material');

//user model
const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //validation for email
        match: [/.+@.+\..+/, "Please provide a valide email address"],
    },
    passowrd: {
        type: String,
        required: true,
        minlength: 8,
    },
    uprightOnly: {
        type: Boolean,
        require: true,
    },
    logs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Log",
        },
    ],
});

// `pre` hook to obfuscate password before saving to DB
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const saltRounds = 8;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
    }
    //relingquish to nxt midware
    next();
});

//Method for all instances of `User` can use this to validate pw
userSchema.methods.validatePW = async function (password) {
    return bcrypt.compare(password, this.password);
};

//instanciate a new user model with this schemaw;
const User = model('User', userSchema);

//exoprt
module.exports = User;