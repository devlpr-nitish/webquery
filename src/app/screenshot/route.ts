import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(req: Request) {
  const body = await req.json();
  const {url} = body;

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshotBuffer = await page.screenshot({ fullPage: true }) as Buffer;   

    await browser.close();
    const base64Image = `data:image/png;base64,${(screenshotBuffer as Buffer).toString('base64')}`;

    return new Response(JSON.stringify({res_image: base64Image }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Screenshot error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get screenshot of the page' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }); 
  }
}
