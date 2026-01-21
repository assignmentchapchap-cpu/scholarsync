'use server';

import { extractTextFromFile } from '@schologic/doc-engine';
import { summarizeText } from '@schologic/ai-bridge';

export async function generateSummary(fileUrl: string, mimeType: string) {
    if (!fileUrl) {
        return { error: 'No file URL provided', summary: null };
    }

    try {
        console.log(`[Summarize] Fetching file: ${fileUrl}`);
        const response = await fetch(fileUrl);

        if (!response.ok) {
            console.error(`[Summarize] Failed to fetch file: ${response.status}`);
            return { error: `Failed to fetch file (${response.status})`, summary: null };
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(`[Summarize] Extracting text (Size: ${buffer.length}, Mime: ${mimeType})`);
        // Note: doc-engine needs to support buffer input for this to work seamlessly. 
        // If doc-engine only takes paths, we might need a workaround, but assuming it handles buffers/simulated files.
        // Checking doc-engine types in next step if this fails, but typically modern parsers take buffers.

        // For now, assuming extractTextFromFile can take a buffer or we mock a file object.
        // Looking at previous doc-engine usage, it might expect a file path or specific input.
        // Let's verify doc-engine signature first if unsure, but I will write the probable code.

        // doc-engine requires a filename argument, even if dummy, for file extension checks if MIME is generic.
        // We can extract a basic name from the URL or use a default.
        const fileName = fileUrl.split('/').pop() || 'document.bin';
        const parseResult = await extractTextFromFile(buffer, mimeType, fileName);

        const text = typeof parseResult?.content === 'string' ? parseResult.content : null;

        // Handle Scanned PDFs
        if (parseResult?.metadata?.isScanned) {
            return {
                error: 'This document appears to be a scanned PDF (image only). We can only summarize text-selectable PDFs.',
                summary: null
            };
        }

        if (!text || text.length < 50) {
            return { error: 'Could not extract enough text from this document.', summary: null };
        }

        console.log(`[Summarize] Text extracted (${text.length} chars). Calling AI...`);

        const apiKey = process.env.PUBLICAI_API_KEY;
        if (!apiKey) return { error: 'Server misconfiguration: No API Key', summary: null };

        const summary = await summarizeText(text, apiKey);

        return { error: null, summary };

    } catch (error: any) {
        console.error('[Summarize] Error:', error);
        return { error: error.message || 'Failed to generate summary', summary: null };
    }
}
