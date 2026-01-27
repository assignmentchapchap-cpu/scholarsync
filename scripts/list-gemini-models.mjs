// Quick script to list available Gemini models
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCddAccV5IzmxufwnQllaWsKI93yLOmZ3I';

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        console.log('\n=== Available Gemini Models ===\n');
        data.models.forEach(m => {
            console.log(`${m.name}`);
            console.log(`  Display: ${m.displayName}`);
            console.log(`  Methods: ${m.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            console.log('');
        });
    })
    .catch(err => console.error('Error:', err));
