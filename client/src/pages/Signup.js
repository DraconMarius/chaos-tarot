import React, { useState } from 'react';
//mutation hook 
import { useMutation } from '@apollo/client';
import { SIGNUP } from './../utils/mutation'
import { Button, TextField, Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';

const StyledForm = styled('form')`
  width: 100%;
  margin-top: 1em;
`;

const Signup = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // Replace this with your sign up logic
        console.log({
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
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