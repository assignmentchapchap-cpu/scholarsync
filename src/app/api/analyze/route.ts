import { NextRequest, NextResponse } from 'next/server';

const HF_API_URL = "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta";

// Helper to split text
function splitIntoSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const sentences = splitIntoSentences(text);
        const results = [];
        let totalWords = 0;
        let suspectedWords = 0;

        // Process sentences (Sequentially to avoid rate limits on free tier, or parallel if robust)
        for (const sent of sentences) {
            const trimmed = sent.trim();
            if (!trimmed) continue;

            const words = trimmed.split(/\s+/).length;
            totalWords += words;

            try {
                const response = await fetch(HF_API_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ inputs: trimmed }),
                });

                if (!response.ok) {
                    console.error("HF API Error:", response.status, response.statusText);
                    results.push({ sentence: sent, score: 0, isSuspected: false });
                    continue;
                }

                const data = await response.json();
                // Expected format: [[{label: 'ChatGPT', score: 0.9}, ...]]
                const scores = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
                const aiScoreOb = scores.find((s: any) => s.label === 'ChatGPT' || s.label === 'AI');

                const aiProb = aiScoreOb ? aiScoreOb.score : 0;
                const isSuspected = aiProb > 0.7;

                if (isSuspected) suspectedWords += words;

                results.push({
                    sentence: sent,
                    score: aiProb,
                    isSuspected
                });

            } catch (err) {
                console.error("Error analyzing sentence:", err);
                results.push({ sentence: sent, score: 0, isSuspected: false });
            }
        }

        const globalScore = totalWords > 0 ? (suspectedWords / totalWords) * 100 : 0;

        return NextResponse.json({
            globalScore,
            sentences: results,
            wordCount: totalWords,
            suspectedWordCount: suspectedWords
        });

    } catch (error) {
        console.error("Analyze API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
