import OpenAI from 'openai';

const configuration = new OpenAI.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAI.OpenAIApi(configuration);

console.log('OpenAIApi Loaded Successfully:', openai);
