import {config} from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {Configuration, OpenAIApi} from 'openai';
//import {ChatGPTUnofficialProxyAPI} from 'chatgpt';

const Request = express.Request;
const Response = express.Response;

config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log(' process.env.OPENAI_API_KEY',  process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);
/*const ChatGPT = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_API_KEY || '',
})*/


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/hello', (_req, res) => {
    return res.send({ message: 'Hello, World!' });
});

app.post('/api/generate', async (req, res) => {
    const { message } = req.body;
    console.log('message', message);

    const prompt = `User: ${message}\nAI: `;
    const completions = await openai.createCompletion({
        model: 'davinci',
        prompt,
        max_tokens: 64
    });

    const response = completions.data?.choices[0]?.text?.trim();
    console.log('completions.data', completions.data);

    return res.send({ response });
});

app.post('/api/chat', async (req: Request, res: Response) => {
    // @ts-ignore
    const { message } = req.body;

    const completions = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: message}],
        max_tokens: 1024,
    });


    const response = completions.data?.choices[0]?.message;

    // @ts-ignore
    return res.send(response );
});

app.post('/api/chatgpt', async (req, res) => {
    const { message } = req.body;

    //const response = await ChatGPT.sendMessage(message);
    const completions = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: message}],
        max_tokens: 1024,
    });


    const response = completions.data?.choices[0]?.message;
    console.log('response', response);

    return res.send({response});
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

export {};