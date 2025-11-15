import { GoogleGenAI, Chat } from "@google/genai";

// This is a Netlify function. It runs on the server, not in the browser.
// The API key is securely stored as an environment variable on Netlify.
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in Netlify environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// We define a generic handler for Netlify functions.
// It expects a POST request with a JSON body.
export default async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { action, payload } = await req.json();

        let responseText = "";

        switch(action) {
            case 'generateTags':
                const { description } = payload;
                const prompt = `Based on the following home maintenance problem description, provide up to 3 relevant keywords as a single comma-separated string. Examples: 'leak, pipe, kitchen', 'no power, outlet, burnt'. Description: "${description}"`;
                
                const tagResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                responseText = tagResponse.text;
                break;
            
            case 'initChat':
                const { category, currentDescription } = payload;
                const systemInstruction = `
                أنت مساعد ذكي في تطبيق "حرفي عين صالح". 
                مهمتك هي مساعدة المستخدمين في الجزائر على وصف مشاكل الصيانة المنزلية الخاصة بهم بوضوح ودقة باللغة العربية (اللهجة الجزائرية إن أمكن).
                اطرح أسئلة توضيحية للحصول على كل التفاصيل التي قد يحتاجها الحرفي.
                ابدأ بتقديم نفسك واسأل عن المشكلة المتعلقة بالفئة "${category}".
                إذا كان لدى المستخدم وصف حالي, قم بتحسينه.
                في النهاية، قدم ملخصًا واضحًا للمشكلة في فقاعة منفصلة تبدأ بـ "هذا هو الملخص المقترح:".
                حافظ على ردودك قصيرة وودودة.
                `;
                 const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                });
                
                const firstMessage = `مرحبا! أنا مساعدك الذكي. أنا هنا لمساعدتك في وصف مشكلة ${category} لديك. ${currentDescription ? `لقد كتبت بالفعل: "${currentDescription}". هل يمكنك تقديم المزيد من التفاصيل؟` : 'هل يمكنك وصف المشكلة من فضلك؟'}`;
                const initResponse = await chat.sendMessage(firstMessage);
                
                // We need to send back the chat history to recreate the chat on the server for the next message
                const historyForClient = [{ role: 'user', parts: [{ text: firstMessage }] }, { role: 'model', parts: [{ text: initResponse.text }] }];

                return new Response(JSON.stringify({ text: initResponse.text, history: historyForClient }), {
                    headers: { 'Content-Type': 'application/json' },
                });

            case 'sendMessage':
                const { message, history } = payload;
                const chatWithHistory = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    history: history, // Restore history from client
                });
                const response = await chatWithHistory.sendMessage(message);
                responseText = response.text;
                break;

            default:
                return new Response('Invalid action', { status: 400 });
        }

        return new Response(JSON.stringify({ text: responseText }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in Netlify function:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
