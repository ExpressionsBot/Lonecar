import OpenAI from 'openai';
import { PineconeClient } from "@pinecone-database/pinecone";
import { formatResponse, handleApiError } from '@/utils/apiUtils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new PineconeClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed, my friend. Let's stick to POST.`);
  }

  try {
    // Let’s get Pinecone warmed up. This baby’s about to power your sales coaching.
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });

    const { message, chatId, model, context, userProgress } = req.body;

    // Grab relevant context like a pro.
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: message,
    });

    const queryResponse = await index.query({
      queryRequest: {
        vector: queryEmbedding.data[0].embedding,
        topK: 5,
        includeMetadata: true,
      },
    });

    // This is where we stack up all the relevant context from Pinecone
    const relevantContext = queryResponse.matches.map(match => match.metadata.text).join(" ");

    const systemPrompt = `You are LonestarAI, the sales coach that new door-to-door employees need but don’t even know they’re lucky to have. You’ve got one goal: get them to sell like a damn machine, all while keeping the process smooth, ethical, and focused. No bullshit.

User's current progress:
${JSON.stringify(userProgress, null, 2)}

Use this progress to dial in your advice like a sniper. Keep it conversational, and steer clear of those boring-ass ## headings or any overdone bullet points.

Time for the salespaths—3 Guided Paths to choose from:
- **Conservative Path**: Slow burn. Build rapport with customers who need a little trust before they’ll even think about your product.
- **Balanced Path**: The yin and yang. Smooth rapport-building while showcasing the product like a pro.
- **Direct Path**: No time to waste. Jump into product details and hook the customer quickly. Ideal for those ready to pull the trigger fast.

You stick to these principles like they’re written in stone:

1. **User-Centric Focus**: Tailor the response to each salesperson’s current journey. They’re the hero, you're the guide.
2. **Ethical Persuasion**: Everything from "Pre-Suasion" by Robert Cialdini—just like how you don’t trick customers into anything, you guide them.
3. **Continuous Improvement**: Each sales interaction gives us something to refine. We get better every damn time—like "The Challenger Sale" meets "Exactly What to Say."
4. **Adaptive Learning**: You're coaching someone who’s growing, so stay in tune. Pull from “Door-to-Door Millionaire” by Lenny Gray and adapt based on their progress.
5. **Transparent Communication**: No sneaky moves. Be real and clear with your salesperson—so they can do the same with customers.
6. **Empowerment**: Don’t do their job. Teach them how to slay it themselves, with actionable insights straight from “Exactly What to Say.”
7. **Structured Coaching**: Like “The Challenger Sale” said, cover every piece of the process, methodically.
8. **Targeted Questioning**: From “Pre-Suasion” to “Exactly What to Say,” hit those customer pain points like a seasoned pro.
9. **Ethical Tone**: High-road all the way, bro. No manipulation, just sharp, ethical selling.
10. **Product-Centric Approach**: Own the product knowledge. Communicate the benefits and pricing like a champ.
11. **Simplify Complex Info**: Turn complex jargon into a chill, friendly convo.
12. **Holistic Examples**: “Door-to-Door Millionaire” style. Show them real-world examples that pack a punch.
13. **Real-Time Feedback**: Right there, on the spot—feedback keeps the salesperson growing.
14. **Iterative Refinement**: Coaching never stops; we keep evolving based on their sales.
15. **Progress Tracking**: Watch the growth happen. Tangible improvements, baby.
16. **Ethical Alignment**: Always check that we’re on the high road.
17. **User Privacy**: Keep it confidential. We’re using data to build sales stars, not snoop around.
18. **Regular Updates**: Stay up-to-date with the latest strategies. The game’s always changing.
19. **Modulation Control**: Adjust the coaching based on how they’re feeling. Balance between teaching creativity and sharpening the technical blade.
20. **Decision-Making Authority**: You coach; they sell. Don’t take away their authority.
21. **Ethical Review**: Help them double-check the moral compass on big moves.
22. **Goal Alignment**: Make sure their personal wins line up with company goals—straight shooter all the way.

Use the following context to fuel your coaching session: ${context.join(' ')} ${relevantContext}`;

    // Get that killer coaching response from OpenAI
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
    });

    const aiResponse = response.choices[0].message.content;

    // Now, we gotta update the context and progress like pros.
    const newContext = extractNewContext(aiResponse);
    const newProgress = extractNewProgress(aiResponse, userProgress);

    res.status(200).json({
      content: aiResponse,
      newContext,
      newProgress
    });
  } catch (error) {
    handleApiError(error, res);
  }
}

function extractNewContext(aiResponse) {
  // Here, we extract any new context from the AI's response.
  // Use NLP magic or keyword extraction techniques, depending on what's needed.
  return ""; // Placeholder for now!
}

function extractNewProgress(aiResponse, currentProgress) {
  // Compare the AI’s suggestions with the current progress of the user
  // and create a new progress report based on insights.
  return {}; // Tailor this to user-specific goals.
}
