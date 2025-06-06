import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// models/User.mjs

export const convertHtmlToPdf = async (htmlContent, dynamicData, outputPath) => {
  console.log(dynamicData);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome', 
  headless: "new", // Or true, depending on your Puppeteer version
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  timeout: 60000 // Increase timeout to 60 seconds
});
  const page = await browser.newPage();
  
  const injectedHtml = injectDynamicData(htmlContent, dynamicData);

  await page.setContent(injectedHtml, { waitUntil: "networkidle0",  });

  await page.pdf({ path: outputPath+'/suggestion.pdf', format: "A4",printBackground: true});

  await browser.close();

  return outputPath+'/suggestion.pdf';
};


export const outputPath = (id)=>{
  let p = path.join('uploads',id)
  fs.mkdirSync(p, { recursive: true });
  return path.join('uploads', id)
}


const injectDynamicData = (htmlContent, dynamicData) => {
  for (const key in dynamicData) {
    const regex = new RegExp(`{{${key}}}`, "g");
    htmlContent = htmlContent.replace(regex, dynamicData[key]);
  }
  return htmlContent;
};
