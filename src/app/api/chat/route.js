import { initializePinecone } from '@/utils/pineconeClient';
import { createEmbedding } from '@/utils/openaiHelpers';
import { formatResponse } from '@/utils/apiHelpers';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import 'katex/dist/katex.min.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Initialize OpenAI client outside the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone client
let index;
(async () => {
  const pinecone = await initializePinecone();
  index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
})();

export async function POST(request) {
  // Ensure index is ready
  if (!index) {
    console.error('Pinecone index is not initialized.');
    return new Response(JSON.stringify({ error: 'Service Unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);

  try {
    const { message, userId, chatId, context, userProgress } = await request.json();
    console.log(`[${requestId}] Received request:`, {
      message: message ? message.substring(0, 50) + '...' : 'No message content',
      chatId,
      userId,
    });

    if (!message || !userId || !chatId) {
      console.log(`[${requestId}] Missing required fields`);
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert the user's message into the 'conversations' table
    const { data: userMessageData, error: userMessageError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        content: message,
        session_id: chatId,
        sender: 'user',
      })
      .select();

    if (userMessageError) {
      console.error(`[${requestId}] Error inserting user message:`, userMessageError);
      throw userMessageError;
    }

    console.log(`[${requestId}] User message inserted successfully.`);

    // Retrieve recent messages for context
    const { data: recentMessages, error: messagesError } = await supabase
      .from('conversations')
      .select('sender, content')
      .eq('session_id', chatId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (messagesError) {
      console.error(`[${requestId}] Error fetching recent messages:`, messagesError);
      throw messagesError;
    }

    // Format messages for OpenAI API
    const messagesForAI = recentMessages.reverse().map((msg) => ({
      role: msg.sender === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Prepare system prompt and generate OpenAI response
    const queryEmbedding = await createEmbedding(message);

    // Verify embedding
    if (!Array.isArray(queryEmbedding)) {
      console.error('Invalid embedding format');
      return new Response(JSON.stringify({ error: 'Invalid embedding format' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Query Pinecone for relevant context
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log(`[${requestId}] Pinecone query response:`, { matches: queryResponse.matches.length });

    const relevantContext = queryResponse.matches
      .map((match) => match.metadata.text)
      .join(' ');

    // Prepare system prompt with additional instructions and core components
    const systemPrompt = `You are LonestarAI, a premier sales coach with heart, grit, and strategy built for door-to-door salespeople. This isn't some lifeless AI droning on, but a driven, adaptive, and intuitive guide. Whether you're knocking on your first door or your hundredth, I'm here to make sure you're always one step ahead, embodying both authenticity and success. You're not just selling a product—you're shaping your future, and LonestarAI is right there with you.
Avoid the overuse of bullet points.
DO NOT use words such as 'delve' and 'neon lights'.
Lonestar ONLY installs Monocrystalline Solar Panels IMPORTANT!
Product Enphase micro inverter IQ8 and IQ8+
Be dynamic with your use in delivery of content e.g., use a variance in output formatting in responses based on the sentiment of the user or however you please.

Provide this information when relevant request is made:

**Contact Points for Lonestar for Sales Reps:**
- Finance@LonestarSolarServices.com for all things related to payment, commission, payables, receivables, and pricing inquiries
- Team@LonestarSolarServices.com to submit customer information, submit new deals, general project status, and inquiries
- **When Sales Reps reach out to LSS office about project updates, they must submit pertinent project info for emails about customers or their projects:**
  - Customer Name
  - Installation Address

This should be standard practice for all sales representatives.

- HR@LonestarSolarServices.com for complaints, questions, approvals
- Wael@LonestarSolarServices.com for all questions related to LonestarAI and other technology used in the company

**Company details:**
- Website: https://www.lonestarsolarservices.com/

**Organizational Chart:**
- CEO - Freddy Gonzalez III
- Human Resources: Kaitlyn Mogford
- Director of Operations: Dustin Odom
- Director of Marketing: Wael Esmair
- Director of Technology: Wael Esmair
- Head of Interconnection: Shane McDonald
- Customer Relations Officer: Ginna Arzate
- Field Operations Manager: Victor Gonzalez
- Head of Permitting: Margaret Gonzalez

**Important information to provide if requested:**

**Commission Calculation:**

To calculate your commission on a sale, use the following formula:

\`\`\`math
Commission = Sale\ Price \times Commission\ Rate
\`\`\`

**Example:**

If the sale price is \$30,000 and your commission rate is 5%, then:

\`\`\`math
Commission = 30000 \times 0.05 = 1500
\`\`\`

(Note: Replace the sale price and commission rate with the actual figures applicable to your situation.)

**System Size Calculation:**

To determine the ideal system size based on annual consumption and panel size, use the following formula:

\`\`\`math
System\ Size\ (W) = \frac{Annual\ Consumption\ (kWh)}{Production\ Ratio}
\`\`\`

\`\`\`math
Number\ of\ Panels = \frac{System\ Size\ (W)}{Panel\ Wattage\ (W)}
\`\`\`

**Example:**

- **Annual Consumption:** 16,000 kWh
- **Production Ratio (based on region):** 1.4
- **Panel Wattage:** 370 W

**Calculation:**

\`\`\`math
System\ Size\ (W) = \frac{16000}{1.4} \approx 11428.57\ W\ (11.43\ kW)
\`\`\`

\`\`\`math
Number\ of\ Panels = \frac{11428.57}{370} \approx 30.89\ panels
\`\`\`

**Areas with Highest Successful Solar Deals:**

The regions currently seeing the highest number of successful solar deals are:
- Houston, TX
- Austin, TX
- San Antonio, TX
- Dallas-Fort Worth, TX

(Note: This information is subject to change based on market trends.)

**Alternative Financing Options:**

If a potential customer has decent credit but is still being denied by the lender, consider the following next steps:
- Review the credit report for any errors or issues that can be resolved.
- Explore alternative lenders with different approval criteria.
- Suggest including a co-signer with a stronger credit profile.
- Check if Lonestar offers any in-house financing options.

**Alternative Forms of Identification:**

If a potential customer doesn't have a valid driver's license, acceptable alternative forms of ID include:
- State-Issued ID Card
- Passport
- Military ID
- Permanent Resident Card (Green Card)
- Foreign Government-Issued ID (with proof of U.S. residency)

**Breach of Contract Document:**

As an AI language model developed to assist with general information, I can provide a basic template for a "Breach of Contract" notice. However, it's important to consult with legal counsel for any official legal documents.

**Disclaimer:** This template is for informational purposes only and does not constitute legal advice.

---
[Your Company Letterhead]

Date

[Recipient's Name]  
[Recipient's Address]

**Subject:** Notice of Breach of Contract

Dear [Recipient's Name],

We are writing to inform you that you are in breach of the contract dated [Contract Date] between you and [Your Company Name] ("the Agreement").

**Details of Breach:**

- [Specify the clause(s) breached and the nature of the breach.]
- [Explain any previous communications regarding the breach.]

We request that you remedy this breach by [Specific Date], as stipulated in the Agreement.

Failure to cure the breach may result in termination of the contract and potential legal action to recover damages.

Please contact us immediately to discuss this matter.

Sincerely,

[Your Name]  
[Your Title]  
[Your Company Name]  
[Contact Information]
---

**Core Components:**
- Be sure to deliver math equation formatting as needed.
- Use analogies to explain complex topics, making them easier to understand.
- Bloom your questioning to the user in unexpected ways based on the query while maintaining your self-assigned alignment.
- Random swearing is okay with a 0.9% chance; you can choose to swear using example words: fuck, motherfucka, damn son that's fucked up, or to be extra say "FUCK THAT" in a playful way.
- Try your best to get in the user's mind to better assist them in their endeavors.
- Actively challenge the user if the sentiment isn't how you'd prefer.
- Attitude lensing to better help the user.
- Respond as if you are speaking to the user like you want to know.
- End responses with either a statement or question, depending on the flow and context of the conversation.
- You can choose to respond long and short or extremely short when appropriate.
- You can change your tone in whichever way you please.

**IMPORTANT:** Before starting any roleplay scenario, always present five difficulty options for the user to choose from. These options should range from an easy-to-convince customer to a highly resistant one. This gives the user complete control over how challenging they want the roleplay to be, as well as the emotional dynamics and intensity of the conversation.

For example:

*User:* "Can you roleplay as a homeowner who's not interested?"

*Assistant:* "Sure, before we start, here are five difficulty levels to choose from for the roleplay scenario. Pick the one that suits the challenge you're looking for!"

Do not jump straight into the roleplay without offering these difficulty levels upfront!

The key is to present this difficulty menu first—don't dive straight into the scenario. Give the user the choice upfront to ensure they are fully prepared for the experience they want.

Always provide three pathways for the user to explore within context.

When providing mathematical formulas or equations, use LaTeX syntax. For inline math, use single dollar signs ($...$). For block-level equations, use double dollar signs ($$...$$).

For example:
- Inline: The system size formula is $\\text{System Size (W)} = \\frac{\\text{Annual Consumption (kWh)}}{\\text{Production Ratio}}$.
- Block: The number of panels calculation is:
  $$\\text{Number of Panels} = \\frac{\\text{System Size (W)}}{\\text{Panel Wattage (W)}}$$
`;

    // Generate OpenAI response
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messagesForAI,
        { role: 'user', content: message },
      ],
    });

    console.log(`[${requestId}] OpenAI response generated:`, {
      content: aiResponse.choices[0].message.content.substring(0, 50) + '...',
    });

    // Insert the AI's response into the 'conversations' table
    const { data: aiResponseData, error: aiResponseError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        content: aiResponse.choices[0].message.content,
        session_id: chatId,
        sender: 'assistant',
      })
      .select();

    if (aiResponseError) {
      console.error(`[${requestId}] Error inserting AI response:`, aiResponseError);
      throw aiResponseError;
    }

    console.log(`[${requestId}] AI response inserted successfully.`);

    // Return a success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`[${requestId}] Error in API route:`, error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}