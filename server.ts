import { config } from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import { Midjourney } from 'midjourney';
import textToSpeech from "@google-cloud/text-to-speech";

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

app.get("/api/hello", (_req, res) => {
  return res.send({ message: "Hello, World!" });
});

app.post("/api/generate", async (req, res) => {
  const { message } = req.body;
  console.log("message", message);

  const prompt = `User: ${message}\nAI: `;
  const completions = await openai.createCompletion({
    model: "davinci",
    prompt,
    max_tokens: 64,
  });

  const response = completions.data?.choices[0]?.text?.trim();
  console.log("completions.data", completions.data);

  return res.send({ response });
});

app.post("/api/chat", async (req: Request, res: Response) => {
  // @ts-ignore
  const { message } = req.body;

  const completions = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    max_tokens: 1024,
  });

  const response = completions.data?.choices[0]?.message;

  // @ts-ignore
  return res.send(response);
});

app.post("/api/chatgpt", async (req, res) => {
  const { message } = req.body;

  //const response = await ChatGPT.sendMessage(message);
  const completions = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    max_tokens: 1024,
  });

  const response = completions.data?.choices[0]?.message;
  console.log("response", response);

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
});

const client = new Midjourney({
  ServerId: process.env.MIDJOURNEY_SERVER_ID,
  ChannelId: process.env.MIDJOURNEY_CHANNEL_ID,
  SalaiToken: process.env.MIDJOURNEY_SALAI_TOKEN,
  Debug: true,
  Ws: true,
});
client.init();

app.post("/api/generate-image", async (req, res) => {
  console.log('ON it')
  const { prompt } = req.body;
  try {
    /*  let generatedPromt = '';
      try {
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

        generatedPromt = completions.data?.choices[0]?.message.content;
      } catch (e) {
        console.log(e.request);
        return res.status(500).send('Could not get promt for image');
      }*/

    /*
    styles: watercolour sketch,
     */
    const Imagine = await client.Imagine('top-down battlemap image for a Dungeons and Dragons encounter' + prompt, (uri, progress) => {
      console.log('Imagine', uri, 'progress', progress);
    });

    /*const Variation = await client.Variation({
      index: 1,
      msgId: Imagine.id,
      hash: Imagine.hash,
      flags: Imagine.flags,
      loading: (uri, progress) => {
        console.log('Imagine', uri, 'progress', progress);
      },
    });
    const Upscale = await client.Upscale({
      index: 2,
      msgId: Variation.id,
      hash: Variation.hash,
      flags: Variation.flags,
      loading: (uri, progress) => {
        console.log('Upscale', uri, 'progress', progress);
      },
    });
    console.log('Heisann');
    console.log({ Upscale });
    console.log('I Have updated: ', Upscale?.uri);
    //await updateExistingProject({ id: projectId, img_url: Variation?.uri }, ['id', 'img_url'], true);
    return res.send(Upscale?.uri);
     */
    return res.send(Imagine?.uri);
  } catch (e) {
    console.log('e', e);
    return res.status(500).send('Noe gikk galt');
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export {};
