import React, { useState } from 'react';

import Reading from './../components/Reading'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';


const Daily = () => {
    const current = new Date();
    const date = ` ${current.getMonth()} / 
                    ${current.getDate()} / 
                    ${current.getFullYear()}`


    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(formData);
    //     // Submit the form data to your API or server here
    // };

    return (
        <Container maxWidth="xs">
            <Grid container direction="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Today is {date}
                </Typography>
                {/* {errorMessage && (
                    <Grid item xs={12}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Grid>)} */}
                <Grid item xs={9}>
                    {/* <Reading data={"daily"} /> */}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Daily;