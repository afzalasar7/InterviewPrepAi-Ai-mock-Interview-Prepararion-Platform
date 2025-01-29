
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 0.8, 
    topP: 0.9, 
    topK: 50, 
    maxOutputTokens: 1024, 
    responseMimeType: "text/plain",
  };
  
  export const chatSession = model.startChat({
    generationConfig,
    // Include safety settings if needed
    // See: https://ai.google.dev/gemini-api/docs/safety-settings
  });
  
   
  