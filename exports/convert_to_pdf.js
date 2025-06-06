import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// models/User.mjs

const outputPath = (id)=>{
    let p = path.join(fileUrl,'uploads',id)
    fs.mkdirSync(p, { recursive: true });
    return path.join(fileUrl, 'uploads', id)
  }
  
  
  const injectDynamicData = (htmlContent, dynamicData) => {
    for (const key in dynamicData) {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, dynamicData[key]);
    }
    return htmlContent;
  };

const convertHtmlToPdf = async (htmlContent, dynamicData, outputPath) => {
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']
});
  const page = await browser.newPage();
  
  const injectedHtml = injectDynamicData(htmlContent, dynamicData);

  await page.setContent(injectedHtml, { waitUntil: "networkidle0",  });

  await page.pdf({ path: outputPath+'/suggestion.pdf', format: "A4",printBackground: true});

  await browser.close();

  return outputPath+'/suggestion.pdf';
};


