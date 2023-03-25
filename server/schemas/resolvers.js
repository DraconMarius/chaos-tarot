const { User, Log, Card, Tarot } = require('../models');
//import util function for API Call
const { openaiCreateLog,
    openaiCreateImage,
    downloadImageFromURL,
    uploadImageToCloudinary, resClean, okJSON } = require('../utils/API')

//fs to read and write img for AI edit and download img

const axios = require("axios");

const fs = require("fs"),
    // http = require("http"),
    https = require("https");
const Stream = require("stream").Transform;
const FormData = require('form-data');
// const path = require("path");
// const sharp = require("sharp");

// openai api for generation;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    // organization: "org-1nvXFlSzwuTzmg1WTc0CyxH8",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { LocalConvenienceStoreOutlined } = require('@mui/icons-material');

const resolvers = {
    Query: {
        //get self from loggedIn context
        me: async (parent, args, context) => {
            return User.findbyId(context.user._id).populate({
                path: 'logs',
                populate: {
                    path: 'cards'
                }
            });
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
            const user = await User.findOne({ email }).populate({
                path: 'logs',
                populate: {
                    path: 'cards'
                }
            });
            //checking if user with the email exist in DB
            console.log(user);
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
                    Pick a really random ${num} card for a ${question} reading that includes ${pref} for Major and Minor arcana Tarot cards as a possibility, 
                    and list 1 concise advice per Card you would share to clarify. Respond in a JSON-string so it can be parsed directly.
                    JSON-like String: 
                    {card: 'card name', upright: 'true / false', 'imagery': imagery, meaning: 'meaning', advice: 'advice'};`

            //reading generation
            const responseReading = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 600,
                stop: ";",
                temperature: 1
            })
            console.log(responseReading.data.choices[0]);
            //make doubly sure the response we get is parsable
            const cleanedRes = await resClean(responseReading.data.choices[0].text);
            //json parse, has error handling in util parse fn
            const finalRes = await okJSON(cleanedRes);
            console.log(cleanedRes);
            console.log(finalRes);

            const logCont = {
                question: question,
                cards: [],
                note: cleanedRes
            }
            const newLog = await Log.create(logCont);
            console.log(newLog);
            return newLog;
        },

        createCard: async (parent, { note, logId }) => {
            const obj = okJSON(note);
            console.log(obj);
            const flip = "is upside down"
            const cardName = obj.card;
            let prompt = obj.imagery;
            const upright = obj.upright;

            if (!upright) {
                return prompt = `${description}, ${flip}`
            };

            const inputImageURL = "https://res.cloudinary.com/dbjhly3lm/image/upload/v1679693646/input.png";
            const maskImageURL = "https://res.cloudinary.com/dbjhly3lm/image/upload/v1679693645/mask.png";

            let formData = new FormData();
            const apiUrl = 'https://api.openai.com/v1/images/variations';
            const headers = {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            };

            formData.append('image', await axios.get(inputImageURL, { responseType: 'arraybuffer' }), {
                filename: 'input.png',
                contentType: 'image/png'
            });
            formData.append('mask', await axios.get(maskImageURL, { responseType: 'arraybuffer' }), {
                filename: 'mask.png',
                contentType: 'image/png'
            });
            formData.append('prompt', prompt);
            formData.append('n', "1");
            formData.append('size', "512x512");

            const response = await axios.post(apiUrl, formData, { headers });
            console.log(response.data);
            const imageUrl = response.data.data[0].url;
            console.log(imageUrl)

            await downloadImageFromURL(imageUrl);

            //const imageURL = await Promise.all(images.map(uploadImageToCloudinary));

            const cardCont = [{
                name: cardName,
                image: imgRes,
                description: prompt,
                upright: upright
            }
                // {
                //     name: "test2",
                //     image: "4",
                //     upright: false
                // }
            ];
            const newCards = await Card.insertMany(cardCont);
            console.log(newCards);
            const newCardsID = newCards.map(card => card._id);
            console.log(newCardsID + "test");

            const insertLog = await Log.findByIdAndUpdate(
                logId,
                {
                    $set: {
                        card: [...newCards]
                    }
                },
                { new: true }
            );

            const populateLog = await insertLog.populate("cards").execPopulate();

            console.log(populateLog);

            return populateLog;
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
