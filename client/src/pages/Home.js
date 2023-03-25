
import React, { useState, useEffect, useRef } from 'react';
import { FlippingPages } from 'flipping-pages';
import { Paper, Typography } from '@mui/material';
// import "../styles/Home.css";
import styled from '@emotion/styled';

const Home = () => {
    const [selected, setSelected] = useState(0);
    const back = () => {
        setSelected(selected => Math.max(selected - 1, 0));
    }
    const next = () => {
        setSelected(selected => Math.max(selected + 1, 1));
    }

    return (
        <div className="pages">
            <FlippingPages
                direction="right-to-left"
                onSwpeEnd={setSelected}
                selected={selected}
            >
                <div className="page page1"><Paper>Page 1</Paper></div>
                <div className="page page2"><Paper>Page 2</Paper></div>
                <div className="page page3"><Paper>Page 3</Paper></div>
            </FlippingPages>

            <div className="container">
                <div>
                    <button onClick={back}>Back</button>
                    <button onClick={next}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Home;