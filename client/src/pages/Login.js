import React, { useState } from 'react';
//mutation hook 
import { useMutation } from '@apollo/client';
import { LOGIN } from './../utils/mutation'
//mUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import styled from '@emotion/styled';

import Auth from './../utils/auth'

const StyledForm = styled('form')`
  width: 100%;
  margin-top: 1em;
`;

const LogIn = () => {

    const [logIn, { error, data }] = useMutation(LOGIN);

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // prep data
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
        };
        try {
            console.log("flag");
            // execute login mutation and pass in variable data from form
            const { data } = await logIn({
                variables: {
                    ...loginData
                },
            });

            //create token for user
            Auth.login(data.logIn.token);
        } catch (error) {
            console.log(error);
            console.error(error);
            setErrorMessage('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Typography component="h1" variant="h5">
                Welcome Back
            </Typography>
            {errorMessage && (
                <Grid item xs={12}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Grid>
            )}
            <StyledForm onSubmit={handleSubmit}>
                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </StyledForm>
        </Grid>
    );
};

export default LogIn;