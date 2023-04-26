import React, { useState, useEffect, useRef } from 'react';
//import useQuery from apollo client to retrieve the user data
import { useQuery } from "@apollo/client";
//importing our query me from utils
import { ME_QUERY } from "../utils/queries";
//importing our tab components on the home page when logged in
import Reading from "../components/Reading";


const homeData = [
    {
        note: "{\"card\": \"Chaos Tarot\", \"meaning\": \"a MERN App generating tarot card reading and imagery using OpenAI's API\", \"advice\": \"For Entertainment Purposes Only\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1682482060/tarot/ri3zwsvgaaaycznibuxz.png" }]
    },
    {
        note: "{\"card\": \"How It Works 1/2\", \"meaning\": \"By utilizing two of OpenAI's API: *Text Completion*, and Image Edit\", \"advice\": \"We first pass a prompt with custom parameters to generate a readingData with the Text Completion end point\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1682398736/tarot/gunhk7g9epskfbl1gzu6.png" }]
    },
    {
        note: "{\"card\": \"How It Works 2/2\", \"meaning\": \"By utilize two of OpenAI's API: Text Completion, and *Image Edit*\", \"advice\": \"We then take the imagery, along with an input and mask image to generate the resulting image, ensuring there are uniformity with the results\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1682397703/tarot/n01whhewykpxg6lafuvl.png" }]
    },
    {
        note: "{\"card\": \"Here are some sample:\", \"meaning\": \"Four of Wands\", \"advice\": \"As with AI generated images, you can get something like this\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1682457646/tarot/px3yl2lp3a5om1abeurr.png" }]
    },
    {
        note: "{\"card\": \"Here are some sample:\", \"meaning\": \"Queen of Pentacles\", \"advice\": \"To something a bit abstract\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1682475922/tarot/qfxguqnrcz2t3li71pn7.png" }]
    },
    {
        note: "{\"card\": \"Here are some sample:\", \"meaning\": \"Queen of Pentacles\", \"advice\": \"To complete @#%$. I will be looking at other image generation model when they become available.\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1682475567/tarot/ate5z7hmtrscreb6cmsz.png" }]
    },
]


const Home = () => {
    //using useQuery hook to retrieve the logged in user's data
    const { loading, error, data } = useQuery(ME_QUERY);

    //if there is an error/, display undefined rather than crashing the app
    const user = data?.me
    console.log(user);
    if (error || !user?.logs?.length) {
        return <>{loading ? <div>Loading...</div> : <Reading logData={homeData} />}</>;
    }
    return <>{loading ? <div>Loading...</div> : <Reading logData={user.logs} />}</>;
}

export default Home
