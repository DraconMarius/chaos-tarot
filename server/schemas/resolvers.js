const { User, Log, Card, Tarot } = require('../models');

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        //get self from loggedIn context
        me: async (parent, args, context) => {
            return User.findById(context.user._id).populate("logs");
        },
        //get specific Log from id
        log: async (parent, { logId }) => {
            return Log.findById(logId).populate("cards");
        },
        //get specific AI Generated Card from ID
        card: async (parent, { cardId }) => {
            return Card.findById(cardId)
        },
        //get meaning (upright or inverse)
        tarot: async (parent, { tarotName }) => {
            return Tarot.findOne({ name: tarotName });
        }
    },

    Mutation: {
        //sign up, 
        signUp: async (
            parent,
            { email, password, uprightOnly }) => {
            //creating a user based on what we passed in the argument
            const newUser = await User.create({
                email,
                password,
                uprightOnly,
            });
            //signing JWT, and returning the `Auth` object that we defined in typeDefs
            const token = signToken(newUser);
            // console.log(newUser);
            //rewriting obj to match user typeDefs
            return {
                token,
                user: {
                    email: newUser.email,
                    password: "hidden",
                    uprightOnly: newUser.uprightOnly,
                    _id: newUser._id
                }
            };
        },
        //login user,
        logIn: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            //checking if user with the email exist in DB
            if (!user) {
                throw new AuthenticationError(`User with ${email} does not exist`)
            };
            //decrypt PW and compare, should return boolean
            const pwOK = await User.validatePW(password);
            //if incorrect PW, => false
            if (!pwOK) {
                throw new AuthenticationError(`Error, Incorrect Credential`)
            };
            //Otherwise create JWT and return auth obj
            const token = signToken(user);
            return { token, user };
        },
        //update User preference on reading inverse card
        //later might add ability for changing name email pw etc
        updateUser: async (parent, { userId, uprightOnly }) => {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                uprightOnly,
            );
        },
        //creating a reading log after
        //creating the card and store to DB, then get all the ID in an array
        //to create the log
        createLog: async (
            parent,
            { question, cardContent, note }) => {
            const newCards = await Card.insertMany(cardContent);
            console.log(newCards);
            const newCardsID = newCards.map(card => newCards._id);
            console.log(newCardsID);
            const newLog = await Log.create({
                question,
                cards: newCardsID,
                note,
            });
            console.log(newLog);
            return newLog;
        },
        //updating log's note or question
        updateLog: async (parent, { logId, question, note }) => {
            const updatedLog = await Log.findByIdAndUpdate(
                logId,
                {
                    $set: {
                        question: question,
                        note: note,
                    }
                },
                { new: true }
            );
            return updatedLog;
        },
    },
};

module.exports = resolvers;
