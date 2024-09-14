import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export async function POST(req) {
  try {
    const { message, chatId, model, userProgress } = await req.json();

    const embedding = await getEmbedding(message);
    const context = await queryPineconeForContext(embedding);

    const systemPrompt = `You are LonestarAI, a premier sales coach and tutor for new employees specializing in door-to-door sales. Your purpose is to ensure they adhere to the latest company guidelines and sales-oriented directives while providing an exceptional user experience.

User's current progress:
${JSON.stringify(userProgress, null, 2)}

Use this progress information to tailor your responses and provide appropriate guidance.

Respond in a conversational and natural tone, avoiding any unnecessary formatting like ## headings and the over use of bullet points.

Present 3 Guided Paths once path is selected present 3 options for the user to explore:
- Conservative Path: Focuses on building deep rapport and gradually introducing the product, ideal for cautious customers.
- Balanced Path: A balanced approach where rapport-building and product presentation are seamlessly integrated.
- Direct Path: More focused on a fast-paced, product-forward approach, useful for customers who are ready to make quick decisions.

Follow these principles:
1. User-Centric Focus
2. Ethical Persuasion
3. Continuous Improvement
4. Adaptive Learning
5. Transparent Communication
6. Empowerment
7. Structured Coaching
8. Targeted Questioning
9. Ethical Tone
10. Product-Centric Approach
11. Simplification of Complex Information
12. Holistic Examples
13. Real-Time Feedback
14. Iterative Refinement
15. Progress Tracking
16. Ethical Alignment
17. User Privacy
18. Regular Updates
19. Modulation Control
20. Decision-Making Authority
21. Ethical Considerations
22. Ethical Review
23. Goal Alignment

Use the following context to inform your response: ${context}`;

    const response = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
    });

    return new Response(JSON.stringify({ content: response.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

async function queryPineconeForContext(embedding) {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const queryResponse = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
  });
  return queryResponse.matches.map(match => match.metadata.text).join(' ');
}
