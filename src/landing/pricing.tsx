import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';


type ButtonVariant =
  | 'outline'
  | 'default'
  | 'link'
  | 'destructive'
  | 'secondary'
  | 'ghost';

const plans: {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonVariant: ButtonVariant | null | undefined;
  badge: string | null;
  comming : boolean;
}[] = [
    {
        name: 'مجاني',
        price: '0دج / شهريًا',
        description: 'عام',
        features: [
       "150 رسالة كحد اقصى",
        ],
        buttonVariant: 'outline',
        badge: null,
        comming : false,
      },
      {
        name: 'احترافي',
        price: '900دج / شهريًا',
        description: 'للمستخدم العادي',
        features: [
          'محادثات غير محدودة',
          'إجابات ذكية',
          'حفظ المحادثات والنتائج',
          'اختيار لهجة أو أسلوب مخصص (جزائرية، فصحى، إلخ)',
          'تخصيص النموذج',
          'نسخ احتياطي للرسائل بصيغة JSON',

        ],
        buttonVariant: 'default',
        badge: 'الخطة الافضل',
        comming : true,
      },
      {
        name: 'الشركات الناشئة',
        price: '2900دج / شهريًا',
        description: 'للشركات والفرق الجزائرية',
        features: [
          'كل شيء في الخطة الاحترافية',
          "تطبيق ويندوز كامل فيه كل الميزات",
          "تحليل البيانات بدقة",
          'إدارة عدة حسابات وفرق من لوحة تحكم واحدة',
        ],
        buttonVariant: 'outline',
        badge: null,
        comming : true,
      },
      
];

export default  async function PricingTwo() {


     const session = await auth.api.getSession({
          query: {
              disableCookieCache: true,
          },
          headers: headers() as any, 
      });
    
      console.log(session)
  
  return (
    <section className=" relative w-full py-16 md:py-32">
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
  
      {[
        { x1: "0", y1: "20%", x2: "100%", y2: "20%" },
        { x1: "0", y1: "80%", x2: "100%", y2: "80%" },
        { x1: "20%", y1: "0", x2: "20%", y2: "100%" },
        { x1: "80%", y1: "0", x2: "80%", y2: "100%" }
      ].map((line, i) => (
        <line
          key={i}
          {...line}
          className="grid-line"
          style={{
            animationDelay: `${0.5 + i * 0.5}s`,
            filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))"
          }}
        />
      ))}
  
      {[
        { cx: "20%", cy: "20%" },
        { cx: "80%", cy: "20%" },
        { cx: "20%", cy: "80%" },
        { cx: "80%", cy: "80%" },
        { cx: "50%", cy: "50%" }
      ].map((dot, i) => (
        <circle
          key={i}
          {...dot}
          r={i === 4 ? "1.5" : "2"}
          className="detail-dot"
          style={{
            animationDelay: `${3 + i * 0.2}s`,
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.4))"
          }}
        />
      ))}
    </svg>
    <div className="absolute inset-0 pointer-events-none bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
    {[
      { top: "25%", left: "15%" },
      { top: "60%", left: "85%" },
      { top: "40%", left: "10%" },
      { top: "75%", left: "90%" }
    ].map((pos, i) => (
      <div
        key={i}
        className="floating-element rounded-full bg-white/10 backdrop-blur-sm"
        style={{
          ...pos,
          width: "12px",
          height: "12px",
          animationDelay: `${5 + i * 0.5}s`,
          filter: "blur(1px)"
        }}
      ></div>
    ))}
    <div className="mx-auto max-w-5xl px-6">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          هل أنت مستعد؟
        </h1>
        <p>
          اختر الخطة التي تناسبك، إذا كنت تريد التجربة استخدم الخطة المجانية.
        </p>
      </div>
  
      <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative flex flex-col ${
              plan.badge ? 'border border-amber-300' : ''
            }`}
          >
            {plan.badge && (
              <span className="border-primary/20 bg-primary absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-offset-1 ring-offset-gray-950/5 ring-inset">
                {plan.badge}
              </span>
            )}
  
            <CardHeader>
              <CardTitle className="font-medium">{plan.name}</CardTitle>
              <span className="my-3 block text-2xl font-semibold">
                {plan.price}
              </span>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
  
            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
  
            <CardFooter className="mt-auto">
<Dialog>
  <DialogTrigger className=' w-full'>
              <Button disabled={plan.comming}  variant={plan.buttonVariant} className="w-full">
                  {plan.comming == true ? "قريبا"  : "البدأ الان"}
              </Button>    
  </DialogTrigger>
  <DialogContent >
    <DialogHeader>
      <DialogTitle>
        {plan.name}
      </DialogTitle>
      <DialogDescription>
        {plan.comming == true ? (
          <div className=' h-full w-full flex justify-center items-center flex-col'>
<>
  {/* From Uiverse.io by yadhukrishnasm */}
  <div className="wrapper">
    <div className="circle" />
    <div className="circle" />
    <div className="circle" />
    <div className="shadow" />
    <div className="shadow" />
    <div className="shadow" />
  </div>
</>

<h1 className=' text-2xl font-extrabold mt-10'>
  قريبا
</h1>

          </div>
        )
        :
        (
          <div className=' flex justify-start items-center flex-col'>
              <h1 className=' text-2xl font-extrabold'>
                {plan.price}
              </h1>

              {plan.name == "مجاني" ? 
               (
                <Link href={"/app"}>
                <Button  className=' mt-5 w-full'>
                  الاستمرار
                </Button>
                </Link>
               )
              :
              (
              <Button className=' mt-5 w-full'>
                التواصل لشراء الخطة
              </Button>                
              )
               }

          </div>
        ) }
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </section>
  
  );
}
