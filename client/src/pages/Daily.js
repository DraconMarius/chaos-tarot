import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Paper } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import '../styles/loading.css'


import Reading from './../components/Reading'

import { useQuery, useMutation } from "@apollo/client";
import { USER_QUERY } from '../utils/queries';
import { CREATE_LOG, CREATE_CARD } from '../utils/mutation';

import FormData from 'form-data';

import { okJSON, resClean } from '../utils/API'



const Daily = ({ userId, uprightOnly, logs }) => {
    const current = new Date();
    const date = ` ${current.getMonth()} / 
                    ${current.getDate()} / 
                    ${current.getFullYear()}`

    // console.log(logs);

    const [createLog] = useMutation(CREATE_LOG);
    const [createCard] = useMutation(CREATE_CARD);
    // const [logData, setLogData] = useState();
    const [questionType, setQuestionType] = useState("daily");
    const displayLogData = useRef()

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setQuestionType(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        //check if log contain same dates
        const fetchLogData = async () => {
            let obj;
            // Perform createLog mutation
            console.log(questionType)
            console.log(uprightOnly)
            console.log(userId)

            const { data } = await createLog({
                variables:
                {
                    question: questionType,
                    pref: uprightOnly,
                    num: "1",
                    userId: userId
                }
            });
            console.log("new Log data : ", data.createLog);
            console.log("new Log: QuestionType: ", data.createLog.question)

            const logId = await data.createLog._id
            const stringNote = await data.createLog.note
            const rdy = await resClean(stringNote)
            obj = await okJSON(rdy);
            console.log(logId)
            console.log(obj);
            const flip = "Inverted"
            const style = "in 'Single Weight Line Art' style in symbolism"
            const cardName = obj.card;
            let prompt = obj.imagery;
            const upright = obj.upright;
            if (upright === "false") {
                prompt = `${flip} Tarot Card "${cardName}": ${prompt}, ${style}`
            } else {
                prompt = `Tarot Card "${cardName}": ${prompt}, ${style}`
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
            try {
                const { data } = await createCard({
                    variables:
                    {
                        logId: `${logId}`,
                        imgUrl: `${cloudinaryUrl}`,
                        name: `${name}`
                    }
                });


                console.log("createCard data: ", data.createCard);
                displayLogData.current = [...logs, data.createCard];
                console.log(displayLogData.current)
                setLoading(false)
            } catch (e) {
                console.error(e);
            }
        }
        fetchLogData();
    };

    const Style = {
        lordicon: {
            width: "250px",
            height: "250px"
        }
    }
    const [activeIcon, setActiveIcon] = useState(1);

    //everytime loading activate
    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setActiveIcon((prevActiveIcon) => (prevActiveIcon % 4) + 1);
            }, 2000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [loading]);

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
                {(loading && !displayLogData.current) || (!displayLogData.current) ? (
                    <div></div>
                ) : (
                    <Grid item xs={9}>
                        <Reading logData={displayLogData.current} />
                    </Grid>
                )}
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <div className={`lord ${activeIcon === 1 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/wlpxtupd.json"
                        trigger="loop"
                        colors="primary:#9cc2f4,secondary:#eeca66"
                        stroke="45"
                        state="loop-1"
                        style={Style.lordicon}>
                    </lord-icon>
                    <div> Take a breath, this might take few </div>
                </div>
                <div className={`lord ${activeIcon === 2 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/etwtznjn.json"
                        trigger="loop"
                        colors="primary:#a39cf4,secondary:#eeca66"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <div>Generating Tarot Reading and Card Image</div>
                </div>
                <div className={`lord ${activeIcon === 3 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/oswatybr.json"
                        trigger="loop"
                        colors="primary:#08a88a,secondary:#eeaa66"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <div>Loading... I promise it is till Loading...</div>
                </div>
                <div className={`lord ${activeIcon === 4 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/zbopvjaq.json"
                        trigger="loop"
                        colors="primary:#d4f49c,secondary:#e8b730"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <div>         ~ Be Patient! Almost There! ~ </div>
                </div>
            </Backdrop>
        </Container>
    );
};
export default Daily;