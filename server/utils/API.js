//to download image
const fs = require("fs"),
    http = require("http"),
    https = require("https");
const Stream = require("stream").Transform;

//upload/save to cloud
const cloudinary = require('cloudinary')

// openai api for generation;
const { Configuration, Openai, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



const openaiCreateImage = async (cardName) => {
    // Your openai.createImage code here
};

const openaiCreateLog = async (cardName) => {

};

const downloadImageFromURL = async (url, filename) => {
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
                fs.writeFileSync(`./public/assets/tarot/${filename}`, data.read());
            })
        })
};

const uploadImageToCloudinary = async (path, publicId) => {
    cloudinary.v2.uploader
        .upload(`./public/assets/tarot/${filename}`, {
            public_id: `tarot/${filename}`
        })
        .then(result => {
            console.log(result.url);
            cloud_url = result.url;
            return cloud_url
        });
};

module.exports = { openaiCreateImage, downloadImageFromURL, uploadImageToCloudinary };
