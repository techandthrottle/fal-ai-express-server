import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { fal }  from '@fal-ai/client'

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
dotenv.config()

fal.config({
    credentials: process.env.FAL_API_KEY
})

app.post('/api/generate-broll', async (req, res) => {
    try {
        const { prompt, webhookUrl } = req.body;
        if (!prompt || !webhookUrl) {
            return res.status(400).json({ error: 'Prompt and Webhook URL are required.' });
        }

        const { request_id } = await fal.queue.submit("fal-ai/minimax/video-01-live", {
            input: {
                prompt: prompt
            },
            webhookUrl: webhookUrl
        })
        res.json({ request_id: request_id })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the b-roll.' });
    }s
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
