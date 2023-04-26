import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import styled from '@emotion/styled';

const FooterContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const IconContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 200px;
`;

const Footer = () => {
    return (
        <FooterContainer>
            <IconContainer>
                <Link href="https://github.com/DraconMarius" target="_blank" rel="noopener noreferrer">
                    <img src="https://res.cloudinary.com/dbjhly3lm/image/upload/h_50/v1682488301/logo_github_icon_143196_phgakv.png" alt="github" />
                </Link>
                <Link href="https://www.linkedin.com/in/mari-ma-70771585" target="_blank" rel="noopener noreferrer">
                    <img src="https://res.cloudinary.com/dbjhly3lm/image/upload/h_50/v1682488301/logo_linkedin_icon_143191_nv9tim.png" alt="linkedin" />
                </Link>
            </IconContainer>
            <Typography variant="body2" component="p">
                <Link href="https://lordicon.com/" target="_blank" rel="noopener noreferrer">
                    Animated icons by Lordicon.com
                </Link>
            </Typography>
            <Typography variant="body2" component="p">
                Icon credit
                <Link href="https://icon-icons.com/users/14quJ7FM9cYdQZHidnZoM/icon-sets/" target="_blank" rel="noopener noreferrer">
                    {' '}
                    @Anton Kalashnyk{' '}
                </Link>
                &amp;
                <Link href="https://icon-icons.com/pack/Electronic-Devices/1829" target="_blank" rel="noopener noreferrer">
                    {' '}
                    @Unknown
                </Link>
            </Typography>
        </FooterContainer>
    );
};

export default Footer;