import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@emotion/react';
import { PageFlip } from 'react-pageflip';

const HomePageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Page = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const PageContent = styled('div')`
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Home = () => {
    const [date] = useState(new Date().toLocaleDateString());

    return (
        <HomePageContainer>
            <Typography variant="h5" component="h2" gutterBottom>
                {date}
            </Typography>
            <PageFlip>
                <Page>
                    <PageContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome
                        </Typography>
                    </PageContent>
                </Page>
                {/* Add more pages if needed */}
            </PageFlip>
        </HomePageContainer>
    );
};

export default Home;