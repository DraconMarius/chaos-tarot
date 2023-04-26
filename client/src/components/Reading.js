import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ReadingCard = ({ log }) => {
    const { note, cards, date, question, readtype } = log;
    const [showDescription, setShowDescription] = useState(false);
    try {

        const noteData = JSON.parse(note);
        const input = question
        const imagery = noteData.imagery
        // const promptImgaery = cards[0].description

        return (
            <Card sx={{ width: { md: 512 }, justifyContent: "center", margin: '0 auto' }}>
                {cards[0].image ?
                    <CardMedia
                        component="img"
                        height="512"
                        src={cards[0].image}
                        alt={noteData.card}
                        sx={{
                            width: 512,
                            maxheight: 512,
                            objectFit: 'contain',
                            margin: '0 auto',
                            padding: '0 auto',
                            justifySelf: "center"
                        }}
                    /> : <></>
                }
                <CardContent>
                    <Tooltip
                        title={<Typography
                            sx={{
                                borderRadius: 2,
                                fontSize: '16px',
                                color: 'white',
                                maxWidth: '500px',
                                textAlign: 'center'
                            }}
                        >
                            {imagery}
                        </Typography>}
                        open={showDescription}
                        onOpen={() => setShowDescription(true)}
                        onClose={() => setShowDescription(false)}
                        placement="top"
                    >
                        <Typography variant="h4" align="center" component="div" sx={{ pt: 0, mt: 0 }}>
                            {noteData.card}
                        </Typography>
                    </Tooltip>
                    {(noteData.upright || date || readtype) ?
                        <>
                            <Typography variant="subtitle1" align="center">
                                {(noteData.upright === (false || "false" || "False")) ? 'Inverted' : 'Upright'}
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                created at: {date}, a {readtype} reading
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                {input ? `user asked: "${input}` : ""}
                            </Typography>
                        </> : <></>
                    }

                    <Typography variant="h6" sx={[{ mx: 2, my: 2 }]} align="center" gutterBottom>
                        {noteData.meaning}
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom>
                        {noteData.advice}
                    </Typography>
                </CardContent>
            </Card>
        );
    } catch (e) {
        console.log("JSON parse error, abort, please reload", e)
        return (<Card sx={{ maxWidth: { md: 512 }, margin: '0 auto' }}>
            <CardContent>
                <Typography variant="h4" align="center" component="div">
                    Error in retrieving reading from openAI API
                </Typography>
                <Typography variant="h6" sx={[{ mx: 2, my: 2 }]} align="center" gutterBottom>
                    ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Do apologize for the inconvenience
                </Typography>
            </CardContent>
        </Card>)
    }
};


const Reading = ({ logData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % logData.length);
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + logData.length) % logData.length);
    };

    if (!logData) {
        return <div>Error: please refresh to try again OR no reading yet</div>;
    }

    return (
        <Container>
            <Box my={4}>
                <ReadingCard log={logData[currentIndex]} />
            </Box>
            <Box display="flex" justifyContent="space-between">
                <Button variant="contained" onClick={prevCard}>
                    <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
                </Button>
                <Typography>
                    {currentIndex + 1} of {logData.length}
                </Typography>
                <Button variant="contained" onClick={nextCard}>
                    <ArrowForwardIosIcon></ArrowForwardIosIcon>
                </Button>
            </Box>
        </Container>
    );
};

export default Reading;