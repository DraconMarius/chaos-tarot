import React from "react";
//import useQuery from apollo client to retrieve the user data
import { useQuery } from "@apollo/client";
//importing our query me from utils
import { ME_QUERY } from "../utils/queries";
//importing our reading components if logged in otherwise sample
import Reading from "../components/Reading";

// import Auth from '../utils/auth'
const ReadingContainer = () => {
    //using useQuery hook to retrieve the logged in user's data
    const { loading, error, data } = useQuery(ME_QUERY);

    //if there is an error/, display undefined rather than crashing the app
    const user = data?.me;
    console.log(user);
    if (error) {
        console.error("Error in ME_QUERY:", error);
        return <></>;
    }
    return <>{loading ? <div>Loading...</div> : <Reading logData={user.logs} />}</>;
}

export default ReadingContainer
