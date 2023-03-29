import React, { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ReadingCard = ({ log }) => {
    const { note, cards, date, question } = log;
    try {

        const noteData = JSON.parse(note);
        const type = question

        return (
            <Card sx={{ maxWidth: { md: 512 }, margin: '0 auto' }}>
                {cards[0].image ?
                    <CardMedia
                        component="img"
                        height="512"
                        src={cards[0].image}
                        alt={noteData.card}
                        sx={{
                            width: 512,
                            height: 512,
                            objectFit: 'contain',
                            margin: '0 auto'
                        }}
                    /> : <></>
                }
                <CardContent>
                    <Typography variant="h4" align="center" component="div">
                        {noteData.card}
                    </Typography>
                    {(noteData.upright || date || type) ?
                        <>
                            <Typography variant="subtitle1" align="center">
                                {noteData.upright ? 'Upright' : 'Inverted'}
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                created at: {date}, a "{type}" reading
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
        console.log("JSON parse error, abort, please reload")
        return (<Card sx={{ maxWidth: { md: 512 }, margin: '0 auto' }}>
            <CardContent>
                <Typography variant="h4" align="center" component="div">
                    Error in retrieving reading from openAI
                </Typography>
                <Typography variant="h6" sx={[{ mx: 2, my: 2 }]} align="center" gutterBottom>
                    ┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Let me know when you encounter this!
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