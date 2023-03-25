import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

import Reading from './../components/Reading'
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from '../utils/queries';
import { CREATE_LOG, CREATE_CARD } from '../utils/mutation';
import { Configuration, OpenAIApi } from "openai";
import okJSON from '../utils/API'


// import input from './assets/input.png';
// import mask from './assets/mask.png';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const Daily = () => {
    const current = new Date();
    const date = ` ${current.getMonth()} / 
                    ${current.getDate()} / 
                    ${current.getFullYear()}`

    const { loading: loading, data: user } = useQuery(ME_QUERY);
    // const Log = user?.log || [];
    const [createLog] = useMutation(CREATE_LOG);
    const [createCard] = useMutation(CREATE_CARD);
    const [logData, setLogData] = useState(null);
    //check if log contain same dates
    useEffect(() => {
        const hasTodayLog = (logs) => {
            const today = new Date();
            return logs.some(log => {
                const logDate = new Date(log.date);
                return logDate.getDate() === today.getDate() &&
                    logDate.getMonth() === today.getMonth() &&
                    logDate.getFullYear() === today.getFullYear();
            });
        };
        const fetchLogData = async () => {
            if (!loading && user) {
                const logs = user.me.logs;
                const pref = user.me.uprightOnly

                console.log(pref);

                if (!hasTodayLog(logs)) {
                    // Perform createLog mutation

                    const { data } = await createLog({
                        variables:
                        {
                            question: 'Daily',
                            pref: pref,
                            num: "1",
                            userId: user.me._id
                        }
                    });
                    const logId = data.createLog.logId
                    const note = data.createLog.note
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
                    console.log(prompt);
                    //then generate the edit
                    const imgRes = await openai.createImage({
                        promt: prompt,
                        n: 1,
                        size: "512 x 512",
                    });
                    let imgUrl = imgRes.data.data[0].url
                    const name = imgRes.data.created;

                    console.log(imgRes.data)
                    console.log(imgUrl)

                    const { dataCloud } = await createCard({
                        variables:
                        {
                            note: note,
                            logId: logId,
                            imgUrl: imgUrl,
                            name: name
                        }
                    });

                    console.log(dataCloud.getCard);

                    setLogData(dataCloud.createCard);
                } else {
                    const todaysLog = logs.find(log => {
                        const logDate = new Date(log.date);
                        const today = new Date();
                        return logDate.getDate() === today.getDate() &&
                            logDate.getMonth() === today.getMonth() &&
                            logDate.getFullYear() === today.getFullYear();
                    });
                    setLogData(todaysLog);
                }
            }
        };
        fetchLogData();
    }, [loading, logData]);


    return (
        <Container maxWidth="xs">
            <Grid container direction="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Today is {date}
                </Typography>
                {(!logData) ? <div>loading...</div> :
                    <Grid item xs={9}>
                        <Reading data={logData} />
                    </Grid>
                }

            </Grid>
        </Container>
    );
};

export default Daily;