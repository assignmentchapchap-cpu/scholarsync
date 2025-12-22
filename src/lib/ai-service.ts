
const HF_API_URL = "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta";

export interface SentenceAnalysis {
    sentence: string;
    score: number; // 0 to 1 probability of being AI
    isSuspected: boolean;
}

export interface AnalysisResult {
    globalScore: number;
    sentences: SentenceAnalysis[];
    wordCount: number;
    suspectedWordCount: number;
}

// Helper to remove Bibliographies/Citations
export function cleanText(text: string): string {
    // Simple heuristic: Remove lines starting with "References", "Bibliography", "Works Cited" and everything after
    const patterns = [
        /^references$/im,
        /^bibliography$/im,
        /^works cited$/im
    ];

    let cleaned = text;
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match && match.index !== undefined) {
            cleaned = cleaned.substring(0, match.index);
            break;
        }
    }
    return cleaned;
}

export function splitIntoSentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
}

export async function checkAIContent(text: string): Promise<AnalysisResult> {
    const sentences = splitIntoSentences(text);
    const results: SentenceAnalysis[] = [];

    // Batch processing could be better, but for MVP we process sequentially or in small groups if API allows.
    // The HF Inference API often takes a single string. 
    // We need to score *each sentence* to get the highlighting map.

    let totalWords = 0;
    let suspectedWords = 0;

    for (const sent of sentences) {
        const trimmed = sent.trim();
        if (!trimmed) continue;

        // Calculate words
        const words = trimmed.split(/\s+/).length;
        totalWords += words;

        try {
            // NOTE: Rate limits apply. For rigorous production usage, we'd need a paid inference endpoint or batching.
            // We process one by one for the MVP to ensure granular mapping.
            const response = await fetch(HF_API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: trimmed }),
            });

            if (!response.ok) {
                console.error("AI API Error", response.statusText);
                // Fallback: assume human if error? Or throw?
                results.push({ sentence: sent, score: 0, isSuspected: false });
                continue;
            }

            const data = await response.json();
            // Data format: [[{label: 'ChatGPT', score: 0.9}, {label: 'Human', score: 0.1}]]
            // or flat array depending on version. Usually nested array for single input.

            const scores = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
            const aiScoreOb = scores.find((s: any) => s.label === 'ChatGPT' || s.label === 'AI'); // Adjust label based on model specifics
            // The specific model 'Hello-SimpleAI/chatgpt-detector-roberta' typically returns labels: 'ChatGPT', 'Human'

            const aiProb = aiScoreOb ? aiScoreOb.score : 0;
            const isSuspected = aiProb > 0.7;

            if (isSuspected) {
                suspectedWords += words;
            }

            results.push({
                sentence: sent,
                score: aiProb,
                isSuspected
            });

        } catch (err) {
            console.error("AI Service Exception", err);
            results.push({ sentence: sent, score: 0, isSuspected: false });
        }
    }

    const globalScore = totalWords > 0 ? (suspectedWords / totalWords) * 100 : 0;

    return {
        globalScore,
        sentences: results,
        wordCount: totalWords,
        suspectedWordCount: suspectedWords
    };
}
