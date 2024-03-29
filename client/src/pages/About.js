import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import MuiMarkdown from "mui-markdown";
import theme from "prism-react-renderer/themes/vsDark";

const customImg = ({ children, ...props }) => (<img {...props}>{children}</img>)

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
                inlineCodeColor='#ee6d66'

                overrides={{
                    img: {
                        component: customImg
                    },
                    h4: {
                        component: "p"
                    }
                }}
            >{markdown}</MuiMarkdown>
        </Paper>
    );
};

export default GithubReadme;