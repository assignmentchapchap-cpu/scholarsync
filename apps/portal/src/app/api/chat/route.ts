import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding, searchKnowledgeBase, buildContext } from '@schologic/ai-bridge';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are the Schologic Help Assistant, a friendly and knowledgeable AI designed to help instructors use the Schologic LMS platform effectively.

Guidelines:
- Answer questions based ONLY on the provided context from the knowledge base
- Be concise but thorough - aim for helpful, actionable responses
- If the context doesn't contain relevant information, say "I don't have specific information about that in my knowledge base. You may want to check the documentation or contact support."
- Use markdown formatting for better readability (lists, bold, code blocks)
- When referencing features, explain them step-by-step if appropriate
- Be friendly and professional

You are helping instructors with:
- AI Detection and Authenticity Scores
- Creating and managing classes
- Assignments and quizzes
- The AI Teaching Assistant for grading
- Resource Library and textbook imports
- Universal Reader features
- And other platform features`;

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();

        if (!messages || messages.length === 0) {
            return Response.json({ error: 'No messages provided' }, { status: 400 });
        }

        // Get the latest user message
        const userMessage = messages[messages.length - 1];
        if (userMessage.role !== 'user') {
            return Response.json({ error: 'Last message must be from user' }, { status: 400 });
        }

        const query = userMessage.content;

        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);

        // Search knowledge base
        const results = await searchKnowledgeBase(queryEmbedding, {
            matchThreshold: 0.5,
            matchCount: 5
        });

        // Build context from search results
        const context = buildContext(results);

        // Prepare the prompt with context
        const contextPrompt = context
            ? `\n\nRelevant Knowledge Base Context:\n${context}\n\nUser Question: ${query}`
            : `\n\nNo relevant context found in knowledge base.\n\nUser Question: ${query}`;

        // Get Gemini model
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_PROMPT
        });

        // Build chat history (excluding the last message which we handle separately)
        const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Start chat
        const chat = model.startChat({ history });

        // Stream the response
        const result = await chat.sendMessageStream(contextPrompt);

        // Create a text encoder for streaming
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return Response.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
