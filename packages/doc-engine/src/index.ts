
import mammoth from 'mammoth';
import JSZip from 'jszip';
import xml2js from 'xml2js';

// pdf-parse v2 is imported inside extractTextFromPdf function

export interface ParseResult {
    content: any; // String for simple text, Object for structured data (IMSCC)
    title?: string;
    metadata?: any;
}

/**
 * Safely extracts text/content from various file formats.
 * Centralized logic for the entire monorepo.
 */
export async function extractTextFromFile(buffer: Buffer, mimeType: string, fileName: string): Promise<ParseResult | null> {
    try {
        const name = fileName.toLowerCase();


        // Robust PDF Check
        if (mimeType === 'application/pdf' || name.endsWith('.pdf')) {
            console.log("DocEngine: Detected PDF, parsing...");
            const result = await extractTextFromPdf(buffer);

            if (!result) return null; // Parsing failed

            if (result.text.length === 0 && result.numpages > 0) {
                console.warn(`DocEngine: PDF scanned detection (Pages: ${result.numpages}, Text: 0)`);
                return {
                    content: "",
                    metadata: { isScanned: true, pageCount: result.numpages }
                };
            }

            return { content: result.text };
        }

        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const content = await extractTextFromDocx(buffer);
            return content ? { content } : null;
        }

        if (name.endsWith('.imscc') || mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') {
            return await extractImsccSafe(buffer);
        }

        return null;
    } catch (e) {
        console.error("DocEngine Parsing Error:", e);
        return null;
    }
}

interface PdfExtractResult {
    text: string;
    numpages: number;
}

export async function extractTextFromPdf(buffer: Buffer): Promise<PdfExtractResult | null> {
    try {
        console.log(`DocEngine: Starting PDF Parse (v2). Buffer size: ${buffer.length} bytes`);

        // pdf-parse v2 uses class-based API
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: buffer });

        // Get document info for page count
        const info = await parser.getInfo();
        const textResult = await parser.getText();
        await parser.destroy();

        console.log("DocEngine: PDF Parse Result:", {
            numpages: info.total,
            textLength: textResult.text ? textResult.text.length : 0,
            hasText: !!textResult.text
        });

        return {
            text: textResult.text ? textResult.text.trim() : "",
            numpages: info.total || 0
        };
    } catch (e) {
        console.error("PDF Parsing Failed:", e);
        return null;
    }
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string | null> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value ? result.value.trim() : null;
    } catch (e) {
        console.error("DOCX Parsing Failed:", e);
        return null;
    }
}

export async function convertToHtml(buffer: Buffer, mimeType: string): Promise<string | null> {
    try {
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.convertToHtml({ buffer });
            return result.value || null;
        }
        return null;
    } catch (e) {
        console.error("HTML Conversion Failed:", e);
        return null;
    }
}

async function extractImsccSafe(buffer: Buffer): Promise<ParseResult | null> {
    try {
        const zip = await JSZip.loadAsync(buffer);

        // Find imsmanifest.xml anywhere in the zip (ignoring case and __MACOSX)
        let manifestPath: string | null = null;
        zip.forEach((relativePath, file) => {
            if (relativePath.toLowerCase().endsWith('imsmanifest.xml') && !relativePath.includes('__MACOSX')) {
                manifestPath = relativePath;
            }
        });

        if (!manifestPath) {
            console.warn("IMSCC: No imsmanifest.xml found in archive");
            return null;
        }

        const manifestFile = zip.file(manifestPath);
        if (!manifestFile) return null;

        const xmlContent = await manifestFile.async('string');
        const parser = new xml2js.Parser({
            explicitArray: false,
            mergeAttrs: true,
            stripPrefix: true // Simplify XML by removing namespaces
        } as any); // Cast to any to avoid TS error for stripPrefix which exists in the lib but maybe missing in types
        const result = await parser.parseStringPromise(xmlContent);

        // Attempt Title Extraction
        let title: string | undefined = undefined;
        try {
            // 1. Handle namespaced 'lomimscc:' path (if explicit prefix remained or via loose lookup)
            const namespacedTitle = result.manifest?.metadata?.['lomimscc:lom']?.['lomimscc:general']?.['lomimscc:title']?.['lomimscc:string']?._ ||
                result.manifest?.metadata?.['lomimscc:lom']?.['lomimscc:general']?.['lomimscc:title']?.['lomimscc:string'];

            // 2. Common Cartridge Location (metadata -> lom -> general -> title -> string)
            const metadataTitle = result.manifest?.metadata?.lom?.general?.title?.string?._ ||
                result.manifest?.metadata?.lom?.general?.title?.string;

            // 3. Organization Title
            const orgs = result.manifest?.organizations?.organization;
            const orgTitle = Array.isArray(orgs) ? orgs[0]?.title : orgs?.title;

            title = namespacedTitle || metadataTitle || orgTitle;

            if (title && typeof title === 'string') {
                title = title.trim();
            } else {
                title = undefined;
            }

        } catch (e) {
            console.warn("IMSCC Title Extraction Failed:", e);
        }

        return { content: result, title };
    } catch (e) {
        console.error("IMSCC Parsing Failed:", e);
        return null;
    }
}
