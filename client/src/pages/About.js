import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import MuiMarkdown from "mui-markdown";

const GithubReadme = () => {
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        const fetchReadme = async () => {
            const response = await fetch(
                `https://raw.githubusercontent.com/DraconMarius/chaos-tarot/main/README.md`
            );
            const textRes = await response.text();

            setMarkdown(textRes);
        };

        fetchReadme();
    }, []);

    return (
        <Paper>
            <MuiMarkdown
                blockquoteBorderColor='gold'
                overrides={{
                    h1: {
                        component: 'h1'
                    },
                }}
            >{markdown}</MuiMarkdown>
        </Paper>
    );
};

export default GithubReadme;