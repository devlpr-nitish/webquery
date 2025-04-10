
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    const body = await req.json();

    const { content, questions } = body;


    if (!content) {
        return new Response(JSON.stringify({ error: 'Content is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const genAI = new GoogleGenerativeAI('AIzaSyBzOW_eOKVFuef8M78G_c8XfdxQFZ-3lA8');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const result = await model.generateContent(
            content +
            " Questions: " +
            questions +
            " " +
            "You must respond strictly in raw HTML format only — without wrapping the content in any code blocks or escaping characters. Use proper semantic HTML tags such as <h2>, <p>, <ul>, <li>, <strong>, etc. Do not include <html>, <head>, or <body> tags. Your response should be ready to render directly in a browser. If any question is unclear, unanswerable, or seems incorrect, respond with exactly: <p>Sorry, I don't have information for this question.</p>. Do not add anything else. Do not provide explanations or markdown."
        );


        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ answer: text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error while finding answers:', error);
        return new Response(JSON.stringify({ error: 'Failed to find answers' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}