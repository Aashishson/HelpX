// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Validates and prioritizes a complaint.
 * @param {string} description - The user's text complaint.
 * @param {Object} image - Object containing { data: base64String, mimeType: "image/jpeg" }
 */
const processComplaint = async (description, image) => {
  const prompt = `
    Analyze this complaint image and description: "${description}"
    1. Validation: Does the image match the description? (true/false)
    2. Priority: Based on safety and urgency, rate it High, Medium, or Low.
    
    Return ONLY a JSON object: 
    { "isValid": boolean, "priority": "High" | "Medium" | "Low", "reason": "string" }
  `;

  try {
    const result = await model.generateContent([prompt, image]);
    const response = await result.response;
    // Clean and parse the JSON response
    return JSON.parse(response.text().replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("AI Processing failed");
  }
};

module.exports = { processComplaint };
