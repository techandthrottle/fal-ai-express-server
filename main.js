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

app.post('/api/fal-ai/minimax/video-01-live', async (req, res) => {
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
    }
})

app.post('/api/f5-tts', async (req, res) => {
    try {
        const { text, refAudioUrl, webhookUrl } = req.body;
        if (!text || refAudioUrl || !webhookUrl) {
            return res.status(400).json({ error: 'Text, Reference Audio URL and Webhook URL are required.' });
        }

        const { request_id } = await fal.queue.submit("fal-ai/f5-tts", {
            input: {
                gen_text: text,
                ref_audio_url: refAudioUrl,
                model_type: 'F5-TTS'
            },
            webhookUrl: webhookUrl
        })
        res.json({ request_id: request_id })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the the audio.' });
    }
})


app.post('/api/fal-ai/sync-lipsync', async (req, res) => {
    try {
        const { videoUrl, audioUrl, webhookUrl } = req.body;
        if (!videoUrl || !audioUrl || !webhookUrl) {
            return res.status(400).json({ error: 'Audio URL, Video URL and Webhook URL are required.' });
        }

        const { request_id } = await fal.queue.submit("fal-ai/sync-lipsync", {
            input: {
                video_url: videoUrl,
                audio_url: audioUrl
            },
            webhookUrl: webhookUrl
        })
        res.json({ request_id: request_id })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the b-roll.' });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})