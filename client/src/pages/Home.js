import React, { useState, useEffect, useRef } from 'react';
//import useQuery from apollo client to retrieve the user data
import { useQuery } from "@apollo/client";
//importing our query me from utils
import { ME_QUERY } from "../utils/queries";
//importing our tab components on the home page when logged in
import Reading from "../components/Reading";


const homeData = [
    {
        note: "{\"card\": \"Chaos Tarot\", \"meaning\": \"a MERN App generating tarot card reading and imagery using OpenAI's API\", \"advice\": \"For Entertainment Purposes Only\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1680038930/DALL_E_2023-03-28_04.25.51_-_The_Tarot_Card__Ace_of_Wands_ywiup5.png" }]
    },
    {
        note: "{\"card\": \"How It Works 1/2\", \"meaning\": \"By utilizing two of OpenAI's API: *Text Completion*, and Image Edit\", \"advice\": \"We first pass a prompt with custom parameters to generate a readingData with the Text Completion end point\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1680038930/DALL_E_2023-03-28_04.25.51_-_The_Tarot_Card__Ace_of_Wands_ywiup5.png" }]
    },
    {
        note: "{\"card\": \"How It Works 2/2\", \"meaning\": \"By utilize two of OpenAI's API: Text Completion, and *Image Edit*\", \"advice\": \"We then take the imagery from out AI generated readingData, along with an input and mask image to generate the resulting image, ensuring there are uniformity with the results\"}", cards: [{ image: "https://res.cloudinary.com/dbjhly3lm/image/upload/v1680038930/DALL_E_2023-03-28_04.25.51_-_The_Tarot_Card__Ace_of_Wands_ywiup5.png" }]
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
