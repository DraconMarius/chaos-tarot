import React from "react";
//import useQuery from apollo client to retrieve the user data
import { useQuery } from "@apollo/client";
//importing our query me from utils
import { ME_QUERY } from "../utils/queries";
//importing our profile component
import Daily from "../pages/Daily";

// import Auth from '../utils/auth'
const ReadingContainer = () => {
    //using useQuery hook to retrieve the logged in user's data
    const { loading, error, data } = useQuery(ME_QUERY);

    //if there is an error/, display undefined rather than crashing the app
    const user = data?.me;
    console.log(user);
    if (error) {
        console.error("Error in ME_QUERY:", error);
        return <div>Error loading user data. Please try again.</div>;
    }

    return <>{loading ? <div>Loading...</div> : <Daily userId={user._id} uprightOnly={user.uprightOnly} logs={user.logs} />}</>;
}

export default ReadingContainer
