// anthropicbackend.js
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
// node-fetch import
import fetch from 'node-fetch';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.get("/", (req, res) => {
    res.send("Welcome to the ASLCDA backend!");
});

app.post('/anthropic', async (req, res) => {
    try {
        const payload = req.body;
        console.log("Below is unstingified payload");
        console.log(payload);
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Anthropic API error:", errorText);
            return res.status(response.status).send(errorText);
        }

        const data = await response.json();

        // LOG the token usage
        // This depends on the API actually returning a 'usage' field with input_tokens, output_tokens, etc.
        if (data.usage) {
            console.log("Input tokens:", data.usage.input_tokens);
            console.log("Output tokens:", data.usage.output_tokens);
            console.log("Total tokens:", data.usage.input_tokens + data.usage.output_tokens);
        }

        return res.json(data);
    } catch (error) {
        console.error("Error calling Anthropics API:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log('Backend running on http://localhost:3001');
});
