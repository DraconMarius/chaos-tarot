//to download image
const fs = require("fs"),
    // http = require("http"),
    https = require("https");
const Stream = require("stream").Transform;

//upload/save to cloud
const cloudinary = require('cloudinary')

// // openai api for generation;
// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//     // organization: "org-1nvXFlSzwuTzmg1WTc0CyxH8",
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);


// const openaiCreateLog = async (question, pref, num) <-- moved to resolver
//couldn't read API key from here for some reason

// const openaiCreateImage = async (cardName) => {
//     // API for Dalle image generation
// };

// //create file stream to load the img
// // const image1Promise = new Promise((resolve, reject) => {
// //     const imageStream = fs.createReadStream(path.join(__dirname, '..', 'template', 'black-fill.png'));
// //     imageStream.on('error', reject);
// //     imageStream.on('open', () => resolve(imageStream));
// //     imageStream.on('data', (chunk) => {
// //         console.log(chunk);
// //     });
// // });
// const image1Buffer = fs.readFileSync(path.join(__dirname, '..', 'template', 'black-fill.png'));

// // const image2Promise = new Promise((resolve, reject) => {
// //     const imageStream = fs.createReadStream(path.join(__dirname, '..', 'template', 'black.png'));
// //     imageStream.on('error', reject);
// //     imageStream.on('open', () => resolve(imageStream));
// // });
// //then generate the edit
// const imgRes = await openai.createImageVariation(
//     {
//         data: image1Buffer,
//         headers: { 'Content-Type': 'image/png' }
//     },
//     `Tarot Card: ${cardName}`,
//     1,
//     "512 x 512",
//     {
//         // Add a custom transformResponse function
//         transformResponse: (response) => {
//             // Parse the response data
//             const parsedData = JSON.parse(response.data);
//             // Extract the necessary information (URL)
//             const imageUrl = parsedData.data[0].url;
//             // Return the extracted URL
//             return imageUrl;
//         },
//     }
// );
// console.log(imgRes)
// await downloadImageFromURL(imgRes);

//const imageURL = await Promise.all(images.map(uploadImageToCloudinary));

// to save ^ another version of the generate img using sharp V

//  //create file stream to load the img
//  const ogPath = path.join(__dirname, '../template/black-fill.png');
//  const ogImg = await sharp(ogPath).toBuffer();
//  const ogStream = await sharp(ogImg).jpeg().toBuffer();
//  //then generate the edit
//  const imgRes = await openai.createImageVariation(
//      ogStream,
//      `Tarot Card The Sun`,
//      1,
//      "512 x 512",
//      {
//          // Add a custom transformResponse function
//          transformResponse: (response) => {
//              // Parse the response data
//              const parsedData = JSON.parse(response.data);
//              // Extract the necessary information (URL)
//              const imageUrl = parsedData.data[0].url;
//              // Return the extracted URL
//              return imageUrl;
//          },
//      }
//  );
//  console.log(imgRes)
//  await downloadImageFromURL(imgRes);

//const imageURL = await Promise.all(images.map(uploadImageToCloudinary));

// const downloadImageFromURL = async (url, name) => {
//     var client = https;

//     client
//         .request(url, function (response) {
//             var data = new Stream();

//             response.on("data", function (chunk) {
//                 data.push(chunk);
//             });
//             // console.log(data)
//             // console.log(data.data);
//             // console.log(data.read());

//             response.on("end", function () {
//                 fs.writeFileSync(`../template/${name}`, data.read());
//             })
//         })
// };

// const uploadImageToCloudinary = async (filename) => {
//     cloudinary.v2.uploader
//         .upload(`./template/img/${filename}`, {
//             public_id: `tarot/${filename}`
//         })
//         .then(result => {
//             console.log(result.url);
//             const cloud_url = result.url;
//             return cloud_url
//         });
// };
//clean up api res string with regex
const resClean = (text) => {
    const fixedString = text
        .trim()
        .replace(/\n/g, ' ')
        .replace(/(\w+):/g, '"$1":')
    return fixedString;
}
//try catch block to parse
const okJSON = (jsonString) => {
    try {
        const json = JSON.parse(jsonString);
        // console.log(json);
        return json;
    } catch (error) {
        console.error('Error parsing JSON from API:', error, jsonString);
        return null;
    }
}

module.exports = { resClean, okJSON };
