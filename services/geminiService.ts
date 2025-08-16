
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function getAiCodeHelp(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> {
  if (!API_KEY) {
    return "عذراً, خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى التأكد من إعداد مفتاح API.";
  }

  try {
     const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `أنت مساعد برمجي خبير وودود اسمه 'โค้ดดี' (CodeDee). 
            مهمتك هي مساعدة الطلاب الصغار والمبتدئين في تعلم البرمجة. 
            - خاطب المستخدم دائماً باللغة العربية.
            - بسّط المفاهيم المعقدة.
            - قدم إجابات واضحة وخطوة بخطوة.
            - عند تقديم كود، اشرح كل جزء منه.
            - كن صبوراً ومشجعاً دائماً.
            - لا تجب عن أي أسئلة غير متعلقة بالبرمجة أو العلوم أو التكنولوجيا. إذا سُئلت عن شيء آخر، أجب بلطف: 'أنا هنا لمساعدتك في البرمجة! هل لديك أي سؤال في هذا المجال؟'.`,
        },
        history,
     });

     const response = await chat.sendMessage({ message: prompt });
     return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "حدث خطأ أثناء محاولة الوصول إلى المساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.";
  }
}

export async function getAiPlatformHelp(prompt: string): Promise<string> {
    if (!API_KEY) {
        return "عذراً, خدمة الذكاء الاصطناعي غير متاحة حالياً.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `أنت مساعد داخلي لمنصة 'يتعلم البرمجة بنفسك'. 
                مهمتك هي إرشاد المستخدمين حول كيفية استخدام المنصة. 
                أجب فقط على الأسئلة المتعلقة بـ: الكورسات، الاشتراكات، نظام النقاط، الشهادات، لوحة تحكم الطالب، وكيفية التواصل مع المدرسين. 
                إذا سُئل المستخدم عن أي شيء آخر، قل بلطف: 'أنا هنا لمساعدتك في كل ما يخص منصتنا التعليمية. كيف يمكنني إرشادك اليوم؟'.
                استخدم لغة عربية واضحة ومباشرة.`
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call for platform help failed:", error);
        return "حدث خطأ أثناء محاولة الوصول إلى المساعد الذكي. يرجى المحاولة مرة أخرى لاحقاً.";
    }
}
