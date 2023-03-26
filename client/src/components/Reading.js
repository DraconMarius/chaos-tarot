import React, { useState, useEffect } from 'react';
import { FlippingPages } from 'flipping-pages';
import { Button, Container, Box, TextField } from '@mui/material'
import styled from '@emotion/styled'




function Reading({ logData }) {
    const [selected, setSelected] = useState(0);
    console.log(logData)
    const [log, setLog] = useState()
    const okJSON = (logData) => {
        try {
            const json = JSON.parse(logData.note);
            // console.log(json);
            return json;
        } catch (error) {
            console.error('Error parsing JSON from API:', error, logData.note);
            return null;
        }
    }

    useEffect(() => {

    }, [logData]);

    const handleSubmit = (e, newData) => {
        e.preventdefault()
        console.log("Test" + newData)
    }
    // const back = () => {
    //     setSelected(selected => Math.max(selected - 1, 0));
    // }

    const ReadingForm = styled('form')`
    width: 550px;
    height: 733px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    padding: 1rem;
`;


    return (
        <div className="pages">
            {/* <FlippingPages
            // direction="right-to-left"
            // onSwpeEnd={setSelected}
            // selected={selected}
            > */}
            {(!logData) ? ("Error, please refresh to try again") :
                (<div className="page page1">
                    <Container>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '100vh',
                            }}
                        >
                            {/* <img
                                src={display.cards[0].image}
                                alt={display.cards[0].name}
                                style={{ marginBottom: '1rem' }}
                            /> */}
                            <ReadingForm onSubmit={handleSubmit}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Book Title"
                                    name="title"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="author"
                                    label="Author"
                                    name="author"
                                    autoComplete="off"
                                />
                            </ReadingForm>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{ marginTop: '1rem' }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Container></div>)
            }
            {/* </FlippingPages> */}

        </div>
    );
};

export default Reading;