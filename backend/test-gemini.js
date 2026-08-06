require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const result = await model.generateContent("Say Hello");

        console.log(result.response.text());
    } catch (err) {
        console.error("ERROR:");
        console.error(err);
    }
}

test();