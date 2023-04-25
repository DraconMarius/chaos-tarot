import React, { useState, useEffect, useRef } from 'react';

//mutation hook 
import { useQuery, useMutation } from "@apollo/client";
import { UPDATE_USER } from '../utils/mutation';
import { ME_QUERY } from "../utils/queries";
import Auth from '../utils/auth'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import styled from '@emotion/styled';



const StyledForm = styled('form')`
  width: 100%;
  margin-top: 1em;
`;

const User = () => {

    const { loading, error, data } = useQuery(ME_QUERY);

    const uprightOnly = useRef();
    const [flipped, setflipped] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    if (!loading) {

        // const userData = data?.me
        uprightOnly.current = data.me.uprightOnly
        console.log(uprightOnly.current)
    }



    const handleChange = (e) => {
        uprightOnly.current = !uprightOnly.current
        console.log(uprightOnly)

    }

    const [updateUser] = useMutation(UPDATE_USER);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const formData = new FormData(e.currentTarget);
        // prep data to send to server 
        const newObj = {
            userId: data.me._id,
            uprightOnly: uprightOnly.current
        };
        console.log(newObj)
        try {
            // console.log("flag");
            // newUser mutation
            const { data } = await updateUser({
                variables: {
                    ...newObj
                },
            });
            // console.log(data);



        } catch (error) {
            console.log(error);
            console.error(error);
            setErrorMessage('An error occurred while updating user prference. Please try again.');
        };
    };

    return (<> {loading ? <>Loading</> :
        <Grid container direction="column" alignItems="center">

            {errorMessage && (
                <Grid item xs={12}>
                    <Alert severity="error">{errorMessage}</Alert>
                </Grid>
            )}
            <StyledForm onSubmit={handleSubmit}>
                <Grid container direction="column" alignItems="center" spacing={2}>
                    <Grid item xs={12}>

                        <FormControlLabel
                            control={<Switch defaultChecked={uprightOnly.current} onChange={handleChange} />}
                            label="Do you want only upright cards?"
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Update Preference
                        </Button>
                    </Grid>
                </Grid>
            </StyledForm>
        </Grid>
    }
    </>
    );
};

export default User;