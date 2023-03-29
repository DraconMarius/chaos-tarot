const { User, Log, Card, Tarot } = require('../models');
//import util function for API Call
const { resClean, okJSON } = require('../utils/API')


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

            let prompt = `As an experiment: The probability of picking any inverted card is 50%, any Suite in Minor Arcana = 72% (number 1-10 cards = 72%, court cards like page, knight, queen, and king =28%), any Major Arcana =25%. Pick ${num}inverted or upright Major or Minor Arcana card for a ${question} reading based on the probablility provided above.  Provide one sentence about the imagery of the card while keeping it 'g-rated', then provide a upright OR inverted meaning for the card relating to a ${question} reading, and also 1 concise advice per Card you would share to clarify. Only respond in valid JSON string format so it can be parsed directly. {"upright": "(false)/(true)", "card": "name", "imagery": "imagery", "meaning" :"uprightmeaning OR invertedmeaning", "advice": "advice"};`

            if (pref) {
                prompt = `As an experiment: The probability of picking any Suite in Minor Arcana = 72% (number 1-10 cards = 72%, court cards like page, knight, queen, and king =28%), any Major Arcana =25%. Pick ${num} inverted or upright Major or Minor Arcana card for a ${question} reading based on the probablility provided above.  Provide one sentence about the imagery of the card while keeping it 'g-rated', then provide a upright OR inverted meaning for the card relating to a ${question} reading, and also 1 concise advice per Card you would share to clarify. Only respond in valid JSON string format so it can be parsed directly. {"upright": "true", "card": "name", "imagery": "imagery", "meaning" :"uprightmeaning", "advice": "advice"};`
            }

            console.log(prompt);

            //reading generation
            const responseReading = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 500,
                stop: ";",
                temperature: 0.8
            })
            console.log("og res=>", responseReading.data.choices[0]);
            //make doubly sure the response we get is parsable
            const cleanedRes = await resClean(responseReading.data.choices[0].text);
            //json parse, has error handling in util parse fn
            const finalRes = await okJSON(cleanedRes);
            if (!finalRes) {
                return
            }
            console.log("test cleanedRes -->" + cleanedRes);
            console.log(finalRes);

            const logCont = {
                question: question,
                cards: [],
                note: cleanedRes
            }
            const newLog = await Log.create(logCont);

            //update User entries by pushing newly created Log ID
            const updateUser = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { logs: newLog._id } },
                { new: true }
            );

            console.log(updateUser)
            console.log("newly created Log: " + newLog);
            return newLog;
        },

        createCard: async (parent, { logId, imgUrl, name }) => {

            const getLog = await Log.findById(logId)
            const flip = "Inverted"
            const style = "in 'Single Weight Line Art' style in symbolism"
            const cleanedRes = await resClean(getLog.note)
            const obj = await okJSON(cleanedRes);
            console.log(obj);
            const cardName = obj.card;
            let prompt = obj.imagery;
            const upright = await obj.upright;
            console.log(upright)

            if (upright === "false") {
                prompt = `${flip} Tarot Card "${cardName}": ${prompt}, ${style}`
            } else {
                prompt = `Tarot Card "${cardName}": ${prompt}, ${style}`
            }
            console.log(prompt + "<-- prompt");

            const cardCont = [{
                name: name,
                image: imgUrl,
                description: await prompt,
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
            console.log(newCardsID + " test");

            const insertLog = await Log.findByIdAndUpdate(
                logId,
                {
                    $set: {
                        cards: [...newCardsID]
                    }
                },
                { new: true }
            ).populate("cards");

            console.log("updated Log: " + insertLog)
            return insertLog;
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
