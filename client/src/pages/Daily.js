import React, { useState, useEffect } from 'react';

import Reading from './../components/Reading'
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from '../utils/queries';
import { CREATE_LOG, CREATE_CARD } from '../utils/mutation';


import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';


const Daily = () => {
    const current = new Date();
    const date = ` ${current.getMonth()} / 
                    ${current.getDate()} / 
                    ${current.getFullYear()}`

    const { loading: loading, data: user } = useQuery(ME_QUERY);
    const Log = user?.log || [];
    const [createLog] = useMutation(CREATE_LOG);
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
                if (!hasTodayLog(logs)) {
                    // Perform createLog mutation
                    const { data } = await createLog({
                        variables:
                            { question: 'Daily' }
                    });


                    // Make an axios call here to fetch card data
                    // const cardData = await axios.get(...);

                    // Perform createCard mutation with fetched card data
                    // await createCard({ variables: { cardName: 'Your card name', logId: data.createLog._id } });

                    setLogData(data.createLog);
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
    }, [loading, user, createLog, createCard]);



    return (
        <Container maxWidth="xs">
            <Grid container direction="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Today is {date}
                </Typography>
                {loading ? <div>loading...</div> :
                    <Grid item xs={9}>
                        <Reading data={Log} />
                    </Grid>
                }
            </Grid>
        </Container>
    );
};

export default Daily;