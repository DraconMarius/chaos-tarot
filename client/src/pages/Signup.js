import React, { useState } from 'react';
//mutation hook 
import { useMutation } from '@apollo/client';
import { SIGNUP } from './../utils/mutation'
import Auth from './../utils/auth'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import styled from '@emotion/styled';

const StyledForm = styled('form')`
  width: 100%;
  margin-top: 1em;
`;

const Signup = () => {
    const [uprightOnly, setPref] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setPref(!uprightOnly)
    }

    const [newUser, { error, data }] = useMutation(SIGNUP);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // prep data to send to server
        const newObj = {
            email: formData.get('email'),
            password: formData.get('password'),
            uprightOnly: uprightOnly,
        };
        try {
            // console.log("flag");
            // newUser mutation
            const { data } = await newUser({
                variables: {
                    ...newObj
                },
            });
            // console.log(data);
            //create token for user
            Auth.login(data.signUp.token);
        } catch (error) {
            console.log(error);
            console.error(error);
            setErrorMessage('An error occurred while signing up. Please try again.');
        };
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Typography component="h1" variant="h5">
                Sign up
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
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox onChange={handleChange} />}
                            label="Do you want only upright cards?"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </StyledForm>
        </Grid>
    );
};

export default Signup;