import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import { Midjourney } from 'midjourney';
import textToSpeech from '@google-cloud/text-to-speech';

const Request = express.Request;
const Response = express.Response;
// To use Google Cloud for better speech
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/hello', (_req, res) => {
    return res.send({ message: 'Hello, World!' });
});

app.post('/api/generate', async (req, res) => {
    const { message } = req.body;

    const prompt = `User: ${message}\nAI: `;
    const completions = await openai.createCompletion({
        model: 'davinci',
        prompt,
        max_tokens: 64,
    });

    const response = completions.data?.choices[0]?.text?.trim();

    return res.send({ response });
});

app.post('/api/chat', async (req: Request, res: Response) => {
    // @ts-ignore
    const { message } = req.body;
    try {
        const completions = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            max_tokens: 1024,
        });

        const response = completions.data?.choices[0]?.message;

        // @ts-ignore
        return res.send(response);
    } catch (e) {
        console.log(e.status);
        console.log(e.body);
        return res.status(500).send('Noe gikk galt');
    }
});

app.post('/api/chatgpt', async (req, res) => {
    const { message } = req.body;

    //const response = await ChatGPT.sendMessage(message);
    try {
        const completions = await openai.createChatCompletion({
            model: 'text-davinci-003',
            messages: [{ role: 'user', content: message }],
            max_tokens: 1024,
        });

        const response = completions.data?.choices[0]?.message;
        console.log('response', completions.data);
        Object.keys(completions).forEach((prop) => console.log(prop));

        /*
  // Construct the request
  const textToSpeechRequest = {
    input: { text: response?.content },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };
  // @ts-ignore
  const [textToSpeechResponse] = await textToSpeechClient.synthesizeSpeech(
    //@ts-ignore
    textToSpeechRequest
  );
  console.log(
    "textToSpeechResponse.audioContent",
    textToSpeechResponse.audioContent
  );*/

        return res.send({ response });
    } catch (e) {
        console.log('response', Object.keys(e));
        console.log('response', e.response);
        console.log('response.status', e.response.status);
        console.log('response.status', e.response.error);

        return res.status(500).send('Something went wrong');
    }
});

const client = new Midjourney({
    ServerId: process.env.MIDJOURNEY_SERVER_ID,
    ChannelId: process.env.MIDJOURNEY_CHANNEL_ID,
    SalaiToken: process.env.MIDJOURNEY_SALAI_TOKEN,
    Debug: true,
    Ws: true,
});
client.init();

const generateAiPrompt = async (prompt: string) => {
    const completions = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'user',
                content: `Generate a prompt to create an image for Midjourney from the following text: "${prompt}".`,
            },
        ],
        max_tokens: 1024,
    });

    return completions.data?.choices[0]?.message.content;
};

app.post('/api/generate-image', async (req, res) => {
    console.log('ON it');
    const { prompt } = req.body;
    try {
        /*
    const Imagine = await client.Imagine('top-down battlemap image for a Dungeons and Dragons encounter ' + prompt, (uri, progress) => {
      console.log('Imagine', uri, 'progress', progress);
    });*/

        const Imagine = {
            id: '1123567203200012400',
            flags: 0,
            content:
                '**top-down battlemap image for a Dungeons and Dragons encounter Village shops town square cosy** - <@252892177921867786> (Open on website for full quality) (fast)',
            hash: '226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
            progress: 'done',
            uri: 'https://cdn.discordapp.com/attachments/1043851560796553246/1123567202902212658/xmaz_top-down_battlemap_image_for_a_Dungeons_and_Dragons_encoun_226a11d1-a0ec-415d-b1f2-ba2eee38de1f.webp',
            options: [
                {
                    type: 2,
                    style: 2,
                    label: 'U1',
                    custom: 'MJ::JOB::upsample::1::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'U2',
                    custom: 'MJ::JOB::upsample::2::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'U3',
                    custom: 'MJ::JOB::upsample::3::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'U4',
                    custom: 'MJ::JOB::upsample::4::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: '🔄',
                    custom: 'MJ::JOB::reroll::0::226a11d1-a0ec-415d-b1f2-ba2eee38de1f::SOLO',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'V1',
                    custom: 'MJ::JOB::variation::1::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'V2',
                    custom: 'MJ::JOB::variation::2::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'V3',
                    custom: 'MJ::JOB::variation::3::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
                {
                    type: 2,
                    style: 2,
                    label: 'V4',
                    custom: 'MJ::JOB::variation::4::226a11d1-a0ec-415d-b1f2-ba2eee38de1f',
                },
            ],
        };

        return res.send({ id: Imagine.id, hash: Imagine.hash, flags: Imagine.flags, url: Imagine.uri });
    } catch (e) {
        console.log('e', e);
        return res.status(500).send('Noe gikk galt');
    }
});

app.post('/api/upscale-image', async (req, res) => {
    const { image, index } = req.body;
    try {
        /*
        Until we pay for Midjourney we just send back the image

        const Upscale = await client.Upscale({
            index: index,
            msgId: image.id,
            hash: image.hash,
            flags: image.flags,
            loading: (uri, progress) => {
                console.log('Upscale', uri, 'progress', progress);
            },
        });

        console.log('Upscale', Upscale);
        return res.send(Upscale);
         */
        return res.send(image);
    } catch (e) {
        console.log('e', e);
        return res.status(500).send('Noe gikk galt');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

export {};
