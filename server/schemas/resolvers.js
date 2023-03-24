const { User, Log, Card, Tarot } = require('../models');
//import util function for API Call
const { openaiCreateLog,
    openaiCreateImage,
    downloadImageFromURL,
    uploadImageToCloudinary, resClean, okJSON } = require('../utils/API')

//fs to read and write img for AI edit and download img

// const axios = require("axios");

const fs = require("fs"),
    // http = require("http"),
    https = require("https");
const Stream = require("stream").Transform;
const path = require("path");

// openai api for generation;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    // organization: "org-1nvXFlSzwuTzmg1WTc0CyxH8",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
            const pwOK = await user.validatePW(password);
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
        //creating a text completion
        //creating the card then upload to cloudinary
        //then compile all the info
        //to create the log
        createLog: async (
            parent,
            { question, pref, num }) => {

            //geting reading from API
            //pref = upright and inverted
            //num = 1 or 3
            //question is optional 

            let prompt = `Experiment: You are a tarot card reader. 
                    Simulate a random ${num} card ${question} reading that includes ${pref} major and minor cards as a possibility, 
                    and list 1 concise advice per Card you would share to clarify. Respond in a JSON-string so it can be parsed directly.
                    JSON-like String: 
                    {card: 'card name', upright: 'true / false', meaning: 'meaning', advice: 'advice'};`

            //reading generation
            const responseReading = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 800,
                stop: ";",
                temperature: 0.5
            })
            console.log(responseReading.data.choices[0]);
            //doubly make sure the response we get is parsable
            const cleanedRes = await resClean(responseReading.data.choices[0].text);
            //json parse, has error handling in util parse fn
            const finalRes = await okJSON(cleanedRes);
            console.log(cleanedRes);

            const cardName = finalRes.card

            const cardCont = [{
                name: finalRes.card,
                image: "placeholder",
                upright: finalRes.upright
            }
                // {
                //     name: "test2",
                //     image: "4",
                //     upright: false
                // }, {
                //     name: "test3",
                //     image: "6",
                //     upright: true
                // };
            ];

            const newCards = await Card.insertMany(cardCont);
            console.log(newCards);
            const newCardsID = newCards.map(card => card._id);
            console.log(newCardsID + "<-- CardID test");

            const logCont = {
                question,
                cards: [...newCardsID],
                note: cleanedRes
            }


            const newLog = await Log.create(logCont);
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
