const { User, Log, Card, Tarot } = require('../models');
//import util function for API Call
const { openaiCreateLog,
    openaiCreateImage,
    downloadImageFromURL,
    uploadImageToCloudinary, resClean, okJSON } = require('../utils/API')


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
            console.log(context.user._id)
            return User.findById(context.user._id).populate({
                path: 'logs',
                populate: {
                    path: 'cards'
                }
            })

        },

        user: async (parent, args) => {
            return User.findById(args._id).populate({
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
            console.log(uprightOnly)
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
            { question, pref, num, userId }) => {

            //geting reading from API
            //pref = string true false
            //num = 1 or 3
            //question is optional 

            let prompt = `Choose ${num} random number from -78 to 77 representing upright and inverted tarot card for a ${question} reading with Major and Minor Arcana Tarot cards as a possibility, then one sentence about the imagery of the card, and
            1 concise advice per Card you would share to clarify. Respond in a JSON-string so it can be parsed directly.
            JSON-like String: 
            {card: 'card name', upright: 'true / false', 'imagery': imagery  meaning: 'meaning', advice: 'advice'};`

            if (pref === "true") {
                prompt = `Experiment: You are a tarot card reader, 
                Choose ${num} random number from 0 to 77 representing upright only tarot card for a ${question} reading with Major and Minor Arcana Tarot cards as a possibility, then one sentence about the imagery of the card, and
                 1 concise advice per Card you would share to clarify. Respond in a JSON-string so it can be parsed directly.
                 JSON-like String: 
                 {card: 'card name', upright: 'true / false', 'imagery': imagery  meaning: 'meaning', advice: 'advice'};`
            }

            console.log(prompt);

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

            //update User entries by pushing newly created Log ID
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { matches: newLog._id } },
                { new: true }
            );


            console.log(newLog);
            return newLog;
        },

        createCard: async (parent, { note, logId, imgUrl, name }) => {
            const obj = okJSON(note);
            // console.log(obj);
            const flip = "is upside down"
            const cardName = obj.card;
            let prompt = obj.imagery;
            const upright = obj.upright;

            if (upright === "false") {
                prompt = `Tarot Card "${cardName}", ${prompt}, ${flip}`
            } else {
                prompt = `Tarot Card "${cardName}", ${prompt}`
            }
            console.log(prompt)

            let imageURL = response.data.data[0].url;

            await downloadImageFromURL(imgUrl, name);

            await uploadImageToCloudinary(name);


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
