//to download image
const fs = require("fs"),
    // http = require("http"),
    https = require("https");
const Stream = require("stream").Transform;

//upload/save to cloud
const cloudinary = require('cloudinary')

// openai api for generation;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    // organization: "org-1nvXFlSzwuTzmg1WTc0CyxH8",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const openaiCreateLog = async (question, pref, num) => {
    //pref = upright and inverted
    //num = 1 or 3
    //question is optional 

    let prompt = `Experiment: You are a tarot card reader. 
                    Simulate a random ${num} card ${question} reading that includes ${pref} cards as a possibility, 
                    and list 1 concise advice per Card you would share to clarify. 
                    Only respond in json format: {card: name, meaning: , advice:}`

    //reading generation
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt
    })
    console.log(response)
    return response
};

const openaiCreateImage = async (cardName) => {
    // API for Dalle image generation
};


const downloadImageFromURL = async (url) => {
    var client = https;

    client
        .request(url, function (response) {
            var data = new Stream();

            response.on("data", function (chunk) {
                data.push(chunk);
            });
            // console.log(data)
            // console.log(data.data);
            // console.log(data.read());

            response.on("end", function () {
                fs.writeFileSync(`./template/img/${filename}`, data.read());
            })
        })
};

const uploadImageToCloudinary = async (path, filename) => {
    cloudinary.v2.uploader
        .upload(`./template/img/${filename}`, {
            public_id: `tarot/${filename}`
        })
        .then(result => {
            console.log(result.url);
            cloud_url = result.url;
            return cloud_url
        });
};
//clean up api res string with regex
const resClean = (text) => {
    const fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');
    console.log(fixedString)
    return fixedString;
}
//try catch block to parse
const okJSON = (jsonString) => {
    try {
        const json = JSON.parse(jsonString);
        console.log(json);
        return json;
    } catch (error) {
        console.error('Error parsing JSON from API:', error, jsonString);
        return null;
    }
}

module.exports = { openaiCreateLog, openaiCreateImage, downloadImageFromURL, uploadImageToCloudinary, resClean, okJSON };
