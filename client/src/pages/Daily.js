import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box, Button, FormControl, TextField, InputLabel, MenuItem, Select, Paper, Alert } from '@mui/material';
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
    const date = ` ${current.getMonth() + 1} / 
                    ${current.getDate()} / 
                    ${current.getFullYear()}`

    // console.log(logs);

    const [createLog, { loading: logLoading, error: logError }] = useMutation(CREATE_LOG);
    const [createCard] = useMutation(CREATE_CARD);
    // const [logData, setLogData] = useState();
    const [questionType, setQuestionType] = useState("daily");
    // const [input, setInput] = useState("");
    const input = useRef();

    // const [getEnv, setEnv] = useState()
    const [errorMessage, setErrorMessage] = useState('');
    const displayLogData = useRef()

    const [loading, setLoading] = useState(false);
    const [loadingImg, setloadingImg] = useState(false);

    const handleChange = (event) => {
        setQuestionType(event.target.value);
        // if (questionType !== 'daily') {
        //     setInput(event.target.input)
        // }
    };

    const inputChange = (e) => {
        input.current = `${e.target.value}`
        // console.log(input.current)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        //check if log contain same dates
        const fetchLogData = async () => {
            let obj;
            // Perform createLog mutation
            console.log(questionType)
            console.log(input.current)
            console.log(userId)

            try {

                const logRes = await createLog({
                    variables:
                    {
                        question: input.current,
                        readtype: questionType,
                        pref: uprightOnly,
                        num: "1",
                        userId: userId
                    }
                })

                if (!logLoading || !logError) {
                    setLoading(false)
                    setloadingImg(true)
                }


                console.log(logRes.data.createLog)
                console.log("new Log data : ", logRes.data.createLog);
                console.log("new Log: Question (if not daily): ", logRes.data.createLog.question)

                const logId = await logRes.data.createLog._id
                const stringNote = await logRes.data.createLog.note
                const rdy = await resClean(stringNote)
                obj = await okJSON(rdy);
                console.log(logId)
                console.log(obj);
                const flip = "Inverted"
                const style = "symbolism in 'Single Weight Line Art' design"
                const cardName = obj.card;
                let prompt = obj.imagery;
                const upright = obj.upright;
                if (upright === false || "false" || "False") {
                    prompt = `${style} depicting Tarot Card"${cardName}" ${flip}: ${prompt}`
                } else {
                    prompt = `${style} depicting Tarot Card"${cardName}": ${prompt}`
                }
                console.log(prompt + "<-- prompt");

                // then generate the edit basic <-- generation keep just for sample
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


                const inputImgUrl = 'https://res.cloudinary.com/dbjhly3lm/image/upload/v1682160835/tarot/custom_input.png';
                const maskImgUrl = 'https://res.cloudinary.com/dbjhly3lm/image/upload/v1682160827/tarot/custom_mask.png';
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
                // console.log(imgRes);

                const name = await imgRes.created
                // console.log(name)

                const imgB64 = imgRes.data[0].b64_json;
                const imgBlob = await fetch(`data:image/png;base64,${imgB64}`).then((r) => r.blob());
                const formData = new FormData();
                formData.append("file", imgBlob, "image.png");
                formData.append("upload_preset", "tarotApp_preset");
                formData.append("folder", 'tarot')
                // Set a `name` that ends with .png so that the API knows it's a PNG image

                const cloudinaryRes = await fetch(
                    `https://api.cloudinary.com/v1_1/dbjhly3lm/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                ).then(response => response.json());
                console.log(cloudinaryRes);

                const cloudinaryUrl = await cloudinaryRes.url;
                console.log(cloudinaryUrl);

                const { data } = await createCard({
                    variables:
                    {
                        logId: `${logId}`,
                        imgUrl: `${cloudinaryUrl}`,
                        name: `${name}`
                    }
                });


                console.log("createCard data: ", data.createCard);
                displayLogData.current = [data.createCard, ...logs];
                console.log(displayLogData.current)
                setloadingImg(false)
            } catch (e) {
                console.error(e);
                setloadingImg(false)
                setErrorMessage('An error occurred with generation. Please try again.');
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

    const StyleButton = {
        lordicon: {
            width: "80px",
            height: "80px"
        }
    }

    const [activeIcon, setActiveIcon] = useState(1);

    //everytime loading activate
    useEffect(() => {
        if (loading || loadingImg) {
            const interval = setInterval(() => {
                setActiveIcon((prevActiveIcon) => (prevActiveIcon % 6) + 1);
            }, 2000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [loading, loadingImg]);

    return (
        <>

            <Container maxWidth="xs">
                <Grid container direction="column" alignItems="center">
                    <Typography component="h1" variant="h5">
                        Today is {date}
                    </Typography>
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Grid>
                    )}
                    <Box sx={{ mt: 2, width: '100%' }}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={questionType} onChange={handleChange}>
                                <MenuItem value={'daily'}>Daily</MenuItem>
                                <MenuItem value={'relationship'}>Relationship</MenuItem>
                                <MenuItem value={'abundance'}>Abundance</MenuItem>
                                <MenuItem value={'yes_or_no'}>Yes or No</MenuItem>
                            </Select>
                            {(questionType !== 'daily') ?

                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="input"
                                    label="Question"
                                    name="input"
                                    autoFocus
                                    onChange={inputChange}
                                />

                                : <></>
                            }
                        </FormControl>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" color="primary" onClick={handleSubmit}>
                            <lord-icon
                                src="https://cdn.lordicon.com/wxnxiano.json"
                                trigger="morph"
                                colors="primary:#66d7ee,secondary:#7166ee"
                                stroke="60"
                                state="morph"
                                style={StyleButton.lordicon}>
                            </lord-icon>
                        </Button>
                    </Box>
                </Grid>
            </Container>
            {(loading && !displayLogData.current) || (!displayLogData.current) ? (
                <div></div>
            ) : (

                <Reading logData={displayLogData.current} />

            )}

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
                    <Typography align="center"> Take a breath, this might take few </Typography>
                </div>
                <div className={`lord ${activeIcon === 2 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/etwtznjn.json"
                        trigger="loop"
                        colors="primary:#a39cf4,secondary:#eeca66"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">Loading... I promise it is still Loading...</Typography>
                </div>
                <div className={`lord ${activeIcon === 3 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/oswatybr.json"
                        trigger="loop"
                        colors="primary:#08a88a,secondary:#eeaa66"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center"> ( ͡⌐■_-■)</Typography>
                </div>
                <div className={`lord ${activeIcon === 4 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/zbopvjaq.json"
                        trigger="loop"
                        colors="primary:#d4f49c,secondary:#e8b730"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">  (ಠ_ಠ)⌐■-■ </Typography>
                </div>
                <div className={`lord ${activeIcon === 5 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/jfloqxvk.json"
                        trigger="loop"
                        delay="2000"
                        colors="primary:#ee6d66,secondary:#e8b730"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">ಠ╭╮ಥ</Typography>
                </div>
                <div className={`lord ${activeIcon === 6 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/eqwebkyi.json"
                        trigger="loop"
                        colors="primary:#e8b730,secondary:#08a88a"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻</Typography>
                </div>
            </Backdrop>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingImg}
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
                    <Typography align="center"> gathering ether to create a card </Typography>
                </div>
                <div className={`lord ${activeIcon === 2 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/etwtznjn.json"
                        trigger="loop"
                        colors="primary:#a39cf4,secondary:#eeca66"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">Loading... I promise it is still Loading...</Typography>
                </div>
                <div className={`lord ${activeIcon === 3 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/oswatybr.json"
                        trigger="loop"
                        colors="primary:#08a88a,secondary:#eeaa66"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center"> ( ͡⌐■_-■)</Typography>
                </div>
                <div className={`lord ${activeIcon === 4 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/zbopvjaq.json"
                        trigger="loop"
                        colors="primary:#d4f49c,secondary:#e8b730"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">  (ಠ_ಠ)⌐■-■ </Typography>
                </div>
                <div className={`lord ${activeIcon === 5 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/jfloqxvk.json"
                        trigger="loop"
                        delay="2000"
                        colors="primary:#ee6d66,secondary:#e8b730"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">ಠ╭╮ಥ</Typography>
                </div>
                <div className={`lord ${activeIcon === 6 ? 'active' : ''}`} elevation={0}>
                    <lord-icon
                        src="https://cdn.lordicon.com/eqwebkyi.json"
                        trigger="loop"
                        colors="primary:#e8b730,secondary:#08a88a"
                        stroke="45"
                        style={Style.lordicon}>
                    </lord-icon>
                    <Typography align="center">I wonder what the card will look like?</Typography>
                </div>
            </Backdrop>

        </>

    );
};
export default Daily;