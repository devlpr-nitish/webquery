
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    const body = await req.json();
    const { url } = body;

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const browser = await puppeteer.launch({
            //@ts-ignore
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const textContent = await page.evaluate(() => {
            return document.body.innerText;
        });

        await browser.close();

        return new Response(JSON.stringify({ res_content: textContent }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Content error:', error);
        return new Response(JSON.stringify({ error: 'Failed to get Content of the page' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
