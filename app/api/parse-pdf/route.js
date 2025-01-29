// import { NextResponse } from "next/server";
// import PDFParser from "pdf2json";
// import fs from "fs/promises";
// import path from "path";
// import { chatSession } from "@/utils/GeminiAIModel";  // Import Gemini AI model utility

// // Function to decode percent-encoded characters
// const decodeText = (encodedText) => {
//   return decodeURIComponent(encodedText);
// };

// // Function to extract and clean the text data
// const extractCleanText = (pdfData) => {
//   let cleanText = '';

//   // Loop through pages in the PDF response
//   for (let i = 0; i < pdfData.Pages.length; i++) {
//     const page = pdfData.Pages[i];

//     // Loop through the 'Texts' array of each page
//     for (let j = 0; j < page.Texts.length; j++) {
//       const textObj = page.Texts[j];

//       // Loop through the 'R' array of each text object
//       for (let k = 0; k < textObj.R.length; k++) {
//         const textSegment = textObj.R[k];

//         // Decode and concatenate the text
//         cleanText += decodeText(textSegment.T) + ' ';
//       }
//     }
//   }

//   return cleanText.trim();
// };

// export async function POST(req) {
//   try {
//     const data = await req.formData();
//     const file = data.get("file");

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const tempFilePath = path.join(process.cwd(), "temp.pdf");
//     await fs.writeFile(tempFilePath, buffer);

//     const pdfParser = new PDFParser();

//     return new Promise((resolve) => {
//       pdfParser.on("pdfParser_dataReady", async (pdfData) => {
//         const cleanText = extractCleanText(pdfData); // Extract clean text

//         // Now use Google Gemini API to clean and format the text
//         const InputPrompt = `Clean and format the following text:\n\n${cleanText}`;

//         try {
//           const result = await chatSession.sendMessage(InputPrompt);
          
//           // Process the response from Gemini API
//           const MockJsonResp = result.response
//             .text()
//             .replace(/```json/, '') // Remove starting ```json
//             .replace(/```/, '')
//             .replace(/\*\*/g, '') // Remove all occurrences of ** (for bold text)
//             .replace(/\n*$/, '') // Remove trailing newline characters
//             .trim();

//           await fs.unlink(tempFilePath); // Clean up the temp file

//           // Return the cleaned and formatted text
//           resolve(NextResponse.json({ cleanedText: MockJsonResp }));
//         } catch (geminiError) {
//           await fs.unlink(tempFilePath); // Clean up the temp file
//           resolve(NextResponse.json({ error: geminiError.message }, { status: 500 }));
//         }
//       });

//       pdfParser.on("pdfParser_dataError", async (error) => {
//         await fs.unlink(tempFilePath); // Clean up the temp file
//         resolve(NextResponse.json({ error: error.message }, { status: 500 })); // Handle parsing error
//       });

//       pdfParser.loadPDF(tempFilePath); // Load the PDF file
//     });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { chatSession } from "@/utils/GeminiAIModel"; // Import Gemini AI model utility

const decodeText = (encodedText) => decodeURIComponent(encodedText);

// Improved function to capture text layout and better handle complex formatting
const extractFormattedText = (pdfData) => {
  let formattedText = '';
  let lastY = null; // To track vertical position of text for line breaks
  let lastX = null; // To track horizontal position for potential columns

  pdfData.Pages.forEach((page) => {
    page.Texts.forEach((textObj) => {
      textObj.R.forEach((segment) => {
        const text = decodeText(segment.T);
        const y = textObj.y; // Y position on the page
        const x = textObj.x; // X position on the page

        // Check if the text is on a new line based on Y positioning
        if (lastY !== null && Math.abs(lastY - y) > 10) {
          formattedText += "\n"; // New line if Y position differs significantly
        }

        // Handle column-wise text separation (optional, based on X positioning)
        if (lastX !== null && Math.abs(lastX - x) > 100) {
          formattedText += "   "; // Add extra space to simulate column breaks
        }

        formattedText += text;

        lastY = y;
        lastX = x;
      });
    });
  });

  return formattedText.trim();
};

export async function POST(req) {
  const tempDir = os.tmpdir();

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.pdf`);
    await fs.writeFile(tempFilePath, buffer);

    const pdfParser = new PDFParser();

    return new Promise((resolve) => {
      pdfParser.on("pdfParser_dataReady", async (pdfData) => {
        // Extract raw JSON and formatted text
        const rawTextJson = JSON.stringify(pdfData); // Raw JSON
        const formattedText = extractFormattedText(pdfData); // Cleaned and formatted text

        const InputPrompt = `Clean and format the following text:\n\n${formattedText}`;
        try {
          const result = await chatSession.sendMessage(InputPrompt);
          const cleanedText = result.response
            .text()
            .replace(/```json/, "")
            .replace(/```/, "")
            .replace(/\*\*/g, "") // Remove all occurrences of ** (for bold text)
            .replace(/\n*$/, "") // Remove trailing newline characters
            .trim();

          await fs.unlink(tempFilePath); // Cleanup temporary file
          
          resolve(NextResponse.json({
            cleanedText 
          }));
        } catch (geminiError) {
          console.error("Gemini API Error:", geminiError.message);
          await fs.unlink(tempFilePath);
          resolve(NextResponse.json({ error: geminiError.message }, { status: 500 }));
        }
      });

      pdfParser.on("pdfParser_dataError", async (error) => {
        console.error("PDF Parsing Error:", error.message);
        await fs.unlink(tempFilePath);
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      });

      pdfParser.loadPDF(tempFilePath);
    });
  } catch (error) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
