import React, { useState } from 'react';
import Container from '@mui/material/Container';

const Home = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Submit the form data to your API or server here
    };

    return (
        <Container maxWidth="xs">
            <p>Home</p>
        </Container>
    );
};

export default Home;