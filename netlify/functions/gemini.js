// Use CommonJS require syntax, which is the standard for Netlify Functions.
const { GoogleGenAI } = require("@google/genai");

// The API key is securely stored as an environment variable on Netlify.
const API_KEY = process.env.GEMINI_API_KEY;

// Standard Netlify function handler
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!API_KEY) {
        console.error("GEMINI_API_KEY is not defined in Netlify environment variables");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server configuration error: API key is missing." }),
        };
    }
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const { action, payload } = JSON.parse(event.body);
        let responseData = {};

        switch (action) {
            case 'generateTags': {
                const { description } = payload;
                const prompt = `Based on the following home maintenance problem description, provide up to 3 relevant keywords as a single comma-separated string. Examples: 'leak, pipe, kitchen', 'no power, outlet, burnt'. Description: "${description}"`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                responseData = { text: response.text };
                break;
            }
            
            case 'initChat': {
                const { category, currentDescription } = payload;
                const systemInstruction = `أنت مساعد ذكي في تطبيق "حرفي عين صالح". مهمتك هي مساعدة المستخدمين في الجزائر على وصف مشاكل الصيانة المنزلية الخاصة بهم بوضوح ودقة باللغة العربية (اللهجة الجزائرية إن أمكن). اطرح أسئلة توضيحية للحصول على كل التفاصيل التي قد يحتاجها الحرفي. ابدأ بتقديم نفسك واسأل عن المشكلة المتعلقة بالفئة "${category}". إذا كان لدى المستخدم وصف حالي, قم بتحسينه. في النهاية، قدم ملخصًا واضحًا للمشكلة في فقاعة منفصلة تبدأ بـ "هذا هو الملخص المقترح:". حافظ على ردودك قصيرة وودودة.`;
                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
                
                const firstMessage = `مرحبا! أنا مساعدك الذكي. أنا هنا لمساعدتك في وصف مشكلة ${category || 'عامة'} لديك. ${currentDescription ? `لقد كتبت بالفعل: "${currentDescription}". هل يمكنك تقديم المزيد من التفاصيل؟` : 'هل يمكنك وصف المشكلة من فضلك؟'}`;
                const initResult = await chat.sendMessage(firstMessage);
                
                const historyForClient = [
                    { role: 'user', parts: [{ text: firstMessage }] }, 
                    { role: 'model', parts: [{ text: initResult.text }] }
                ];

                responseData = { text: initResult.text, history: historyForClient };
                break;
            }

            case 'sendMessage': {
                const { message, history } = payload;
                // Ensure history is a valid array, even if the client sends null/undefined
                const validHistory = Array.isArray(history) ? history : [];
                const chatWithHistory = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    history: validHistory,
                });
                const result = await chatWithHistory.sendMessage(message);
                
                // Send the full updated history back to the client
                const updatedHistory = [
                    ...validHistory,
                    { role: 'user', parts: [{ text: message }] },
                    { role: 'model', parts: [{ text: result.text }] }
                ];
                
                responseData = { text: result.text, history: updatedHistory };
                break;
            }

            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Invalid action' }),
                };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responseData),
        };

    } catch (error) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
