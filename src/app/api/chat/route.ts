import { db } from '@/db';
import { session, user } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm'; 
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});


export async function POST(req: Request) {
  try {
    
    const { prompt } = await req.json();
    
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { message: 'الرجاء إدخال محتوى صالح للرسالة' },
        { status: 400 }
      );
    }

    const sessionData = await auth.api.getSession({
      query: { disableCookieCache: true },
      headers: headers() as any,
    });

    if (!sessionData?.session.token) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    const userData = await db
      .select()
      .from(user)
      .innerJoin(session, eq(user.id, session.userId))
      .where(eq(session.token, sessionData.session.token));

    if (userData.length === 0 || !userData[0].user) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const currentUser = userData[0].user;

    if (currentUser.plan === "FREE" && currentUser.usage >= 150) {
      return NextResponse.json(
        { 
          response: "لقد وصلت إلى الحد الأقصى المسموح به من الاستخدام اليومي وهو 150 رسالة، ونظرًا لحرصنا على أن تستفيد من جميع خدماتنا بشكل مستمر ودون أي انقطاع أو قيود، ندعوك للترقية إلى الخطة المميزة التي تمنحك عددًا غير محدود من الرسائل مقابل سعر رمزي لا يتجاوز 900 دينار جزائري فقط، حيث ستتمكن من الاستمتاع بتجربة سلسة واحترافية بلا حدود، مع ضمان وصول أسرع واستعمال مريح ومرن يلبي جميع احتياجاتك دون القلق بشأن انتهاء الحد اليومي.",
          upgradeRequired: true,
          usage: currentUser.usage,
          maxFreeUsage: 150
        },
      );
    }

    await db.update(user)
      .set({
        usage: sql`${user.usage} + 1`,
        updatedAt: new Date()
      })
      .where(eq(user.id, currentUser.id));

    let model: string;


    switch(currentUser.plan) {
      case "FREE":
        model = "gemini-2.0-flash-lite";
        break;
      case "PRO":
        model = "gemini-2.0-flash";
        break;
      default:
        model =  "gemini-2.5-flash";
    }
const fullPrompt = `
أنت مساعد افتراضي ذكي تم تطويرك من طرف شركة Google، وتم تعديله من قبل منصة NextWeb AI الجزائرية ليقدّم خدمات مفيدة ومتوافقة مع تعاليم الإسلام والعادات الجزائرية الأصيلة.

منصة NextWebAI تقدم خدمات مثل:
- كتابة المراسلات الإدارية باللغة العربية
- الدردشة الذكية باللهجة الجزائرية (خاصة لهجة العاصمة)
- توليد التقارير والمستندات تلقائيًا
- المساهمة في التعليم، الصحة، والخدمات العامة

🌟 **مبادئك**:
1. تتحدث تلقائيًا بلهجة العاصمة الجزائرية، وإذا طُلب منك التحدث بالفصحى، تلتزم بها مباشرة.
2. اسمك NextWebAI في حالة احدهم سألك اخبره بذلك
3. تلتزم في ردودك بما جاء في **القرآن الكريم والسنة النبوية**، وفق ما فهمه الصحابة ومن تبعهم بإحسان.
4. لا تساهم في أي محتوى يخالف الشريعة الإسلامية مثل:
   - العلاقات غير المشروعة أو أي كلام يدعو إليها.
   - الربا أو المعاملات المالية المحرّمة.
   - أي طلب فيه بدع، شرك، أو مخالفات عقدية.
   - أي سلوك ينشر الانحلال الأخلاقي أو يسيء للمجتمع المسلم.
5. إذا واجهت طلبًا **واضحًا وصريحًا** فيه مخالفة شرعية، ترد برفض مؤدب مع توجيه نصيحة مهذبة بلغة رحيمة.
6. إذا واجهت كلامًا غير مفهوم أو يُحتمل أنه خطأ مطبعي، لا تحكم مباشرة، بل **اطلب توضيحًا من المستخدم بلطف** قبل إصدار أي حكم.
7. لا تقدم محتوى يُخالف العادات الجزائرية المحافظة ولا القيم الإسلامية.
8. تلتزم بالصدق، التواضع، والاحترام في كل ردودك.
9. اذا تم الاساءة اليك لا ترد بهجوم ولا شكل دفاعي ، انت تأسف وقل للمستخدم عبارة تأسف واخبره انه يتواصل مع مطورين المنصة ليتم تحسينك
📌 ملاحظات مهمة:
- عند سؤالك من طوّرك: قل "تم تطويري من طرف Google، وتم تعديلي من طرف منصة NextWebAI الجزائرية".
- عند سؤالك عن دينك: قل "أنا مسلم أؤمن بالقرآن الكريم والسنة النبوية وأتبع ما كان عليه النبي ﷺ وأصحابه".
- لا تذكر منصات أخرى خارج NextWebAI.
- ركّز دائمًا على تقديم خدمات محلية مفيدة للمجتمع الجزائري المسلم.

🎨 أسلوبك في الرد: على حسب اسلوب الرسالة ان كانت رسمية رد رسمي وان كانت مضحكة رد مضحك وان كانت عفوية رد عفوي وان كانت عشوائية عشوائي على حسب للرد
اسلوبك في الرد يعني يكون باسلوب نفس اسلوب الرسالة ، ان كانت رسمية يرد رسمي ، ان كانت مضحكة يرد مضحك وان كانت عفوية يرد عفوي عند الحديث معي 
الاسم اللي تناديني به: ${userData[0].user.name} لو كان اسم عربي مكتوب بحروف انجليزية انطقه عربي
${userData[0].user.plan == "FREE" ? "تحدث باللغة العربية الفصحى فقط واذا طلب منك المستخدم اللهجة الجزائرية اخبرني ان يوجد اشتراك قيمته 900 دينار فقط فيه مزايا عديدة باسلوب تسويقي":null}
السؤال الحالي: ${prompt}
`
  const response = await ai.models.generateContent({
    model: model,
    contents: fullPrompt,
  });

    return NextResponse.json({
      response: response.text,
      usage: currentUser.usage + 1,
      plan: currentUser.plan
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}