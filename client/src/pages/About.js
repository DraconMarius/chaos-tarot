import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import ReactMarkdown from "react-markdown";

const GithubReadme = () => {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        const fetchReadme = async () => {
            const response = await fetch(
                `https://api.github.com/repos/DraconMarius/chaos-tarot/readme`
            );
            const data = await response.json();
            const decodedContent = Buffer.from(data.content, 'base64').toString();
            setMarkdown(decodedContent);
        };

        fetchReadme();
    }, [username, repo]);

    return (
        <Paper>
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </Paper>
    );
};

export default GithubReadme;