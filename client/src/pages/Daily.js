import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Reading from './../components/Reading'

import { useQuery, useMutation } from "@apollo/client";
import { USER_QUERY } from '../utils/queries';
import { CREATE_LOG, CREATE_CARD } from '../utils/mutation';
import { Configuration, OpenAIApi } from "openai";
import FormData from 'form-data';

import { okJSON, resClean, urlToBase64DataUrl, dataUrlToFile } from '../utils/API'



const Daily = ({ userId, uprightOnly, logs }) => {
    const current = new Date();
    const date = ` ${current.getMonth()} / 
                    ${current.getDate()} / 
                    ${current.getFullYear()}`

    console.log(userId, uprightOnly, logs);

    const [createLog] = useMutation(CREATE_LOG);
    const [createCard] = useMutation(CREATE_CARD);
    const [logData, setLogData] = useState(null);
    const [questionType, setQuestionType] = useState("daily");

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setQuestionType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        //check if log contain same dates
        const fetchLogData = async () => {

            // Perform createLog mutation

            const { data } = await createLog({
                variables:
                {
                    question: questionType,
                    pref: uprightOnly,
                    num: "1",
                    userId: userId
                }
            });
            const logId = await data.createLog._id
            const stringNote = await data.createLog.note

            const obj = okJSON(stringNote);
            console.log(logId)
            console.log(obj);
            const flip = "is upside down"
            const cardName = obj.card;
            let prompt = obj.imagery;
            const upright = obj.upright;
            const advice = obj.advice;
            const meaning = obj.meaning;
            if (upright === "false") {
                prompt = `Tarot Card "${cardName}", ${prompt}, ${flip}`
            } else {
                prompt = `Tarot Card "${cardName}", ${prompt}`
            }
            console.log(prompt + "<-- prompt");

            // then generate the edit
            // const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            //     },
            //     body: JSON.stringify({
            //         prompt: prompt,
            //         n: 1,
            //         size: "512x512",
            //         response_format: "b64_json",
            //     }),
            // }).then(response => response.json());
            // console.log(imgRes)


            const inputImgUrl = 'https://res.cloudinary.com/dbjhly3lm/image/upload/v1679693646/input.png.png';
            const maskImgUrl = 'https://res.cloudinary.com/dbjhly3lm/image/upload/v1679693645/mask.png.png';
            const [inputBlob, maskBlob] = await Promise.all([
                fetch(inputImgUrl).then((r) => r.blob()),
                fetch(maskImgUrl).then((r) => r.blob())
            ]);
            inputBlob.name = "input.png";
            maskBlob.name = "mask.png";

            const imgFormData = new FormData();
            imgFormData.append("image", inputBlob, "input.png");
            imgFormData.append("mask", maskBlob, "mask.png");
            imgFormData.append("prompt", prompt);
            imgFormData.append("n", 1);
            imgFormData.append("size", "512x512");
            imgFormData.append("response_format", "b64_json");

            const imgRes = await fetch('https://api.openai.com/v1/images/edits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
                },
                body: imgFormData
            }).then(response => response.json());
            console.log(imgRes)
                ;

            const name = await imgRes.created
            console.log(name)

            const imgB64 = imgRes.data[0].b64_json;
            const imgBlob = await fetch(`data:image/png;base64,${imgB64}`).then((r) => r.blob());
            const formData = new FormData();
            formData.append("file", imgBlob, "image.png");
            formData.append("upload_preset", "tarotApp_preset");
            // Set a `name` that ends with .png so that the API knows it's a PNG image

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            ).then(response => response.json());
            console.log(cloudinaryRes);

            const cloudinaryUrl = await cloudinaryRes.url;
            console.log(cloudinaryUrl);
            const { dataCloud } = await createCard({
                variables:
                {
                    logId: `${logId}`,
                    imgUrl: `${cloudinaryUrl}`,
                    name: `${name}`
                }
            });

            setLogData(dataCloud);
            console.log(dataCloud);
            setLoading(false);
        }
        fetchLogData();
    };




    return (
        <Container maxWidth="xs">
            <Grid container direction="column" alignItems="center">
                <Typography component="h1" variant="h5">
                    Today is {date}
                </Typography>
                <Box sx={{ mt: 2, width: '100%' }}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select value={questionType} onChange={handleChange}>
                            <MenuItem value={'daily'}>Daily</MenuItem>
                            <MenuItem value={'relationship'}>Relationship</MenuItem>
                            <MenuItem value={'abundance'}>Abundance</MenuItem>
                            <MenuItem value={'yes_or_no'}>Yes or No</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Pull a Card
                    </Button>
                </Box>
                {(!logData) ? (
                    <div></div>
                ) : (
                    <Grid item xs={9}>
                        <Reading data={logData} />
                    </Grid>
                )}
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
};
export default Daily;