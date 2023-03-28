import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled'
import { Button, Container, Box, TextField, Card, CardContent, CardMedia, Typography } from '@mui/material';

const ReadingCard = ({ log }) => {
    const { note, cards, date, question } = log;
    const noteData = JSON.parse(note);
    const type = question

    return (
        <Card sx={{ maxWidth: { md: 512 }, margin: '0 auto' }}>
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
            />
            <CardContent>
                <Typography variant="h4" align="center" component="div">
                    {noteData.card}
                </Typography>
                <Typography variant="subtitle1" align="center">
                    {noteData.upright ? 'Upright' : 'Inverted'}
                </Typography>
                <Typography variant="h6" sx={[{ mx: 4, my: 4 }]} align="center" gutterBottom>
                    {noteData.meaning}
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    {noteData.advice}
                </Typography>
            </CardContent>
        </Card>
    );
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
                    PREV
                </Button>
                <Typography>
                    {currentIndex + 1} of {logData.length}
                </Typography>
                <Button variant="contained" onClick={nextCard}>
                    NEXT
                </Button>
            </Box>
        </Container>
    );
};

export default Reading;