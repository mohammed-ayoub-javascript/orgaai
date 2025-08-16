"use client";

import { Button } from '@/components/ui/button'
import { Cpu, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react';

const tableData = [
    {
        feature: "150 رسالة فقط",
        free: true,
        pro: false,
        startup: false,
    },
    {
        feature: "محادثات غير محدودة",
        free: false,
        pro: true,
        startup: true,
    },
 
     {
        feature: 'اجابات ذكية',
        free: false,
        pro: true,
        startup: true,
    },
     {
        feature: "حفظ المحادثات و النتائج",
        free: false,
        pro: true,
        startup: true,
    },
     {
        feature:"اختيار لهجة أو أسلوب مخصص (جزائرية، فصحى، إلخ)",
        free: false,
        pro: true,
        startup: true,
    },
     {
        feature:"تخصيص النموذج",
        free: false,
        pro: true,
        startup: true,
    },
         {
        feature:"نسخ احتياطي للرسائل بصيغة JSON",
        free: false,
        pro: true,
        startup: true,
    },
     {
        feature:"تطبيق ويندوز كامل فيه كل الميزات",
        free: false,
        pro: false,
        startup: true,
    },
        {
        feature:"تحليل البيانات بدقة",
        free: false,
        pro: false,
        startup: true,
    },
            {
        feature:"إدارة عدة حسابات وفرق من لوحة تحكم واحدة",
        free: false,
        pro: false,
        startup: true,
    },
]

export default function PricingComparator() {
      const gradientRef = useRef<HTMLDivElement>(null);
    
 useEffect(() => {
    const words = document.querySelectorAll<HTMLElement>('.word');
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        word.style.animation = 'word-appear 0.8s ease-out forwards';
      }, delay);
    });

    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + 'px';
        gradient.style.top = e.clientY - 192 + 'px';
        gradient.style.opacity = '1';
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = '0';
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    words.forEach((word) => {
      word.addEventListener('mouseenter', () => {
        word.style.textShadow = '0 0 20px rgba(200, 180, 160, 0.5)';
      });
      word.addEventListener('mouseleave', () => {
        word.style.textShadow = 'none';
      });
    });

    function onClick(e: MouseEvent) {
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '4px';
      ripple.style.height = '4px';
      ripple.style.background = 'rgba(200, 180, 160, 0.6)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'pulse-glow 1s ease-out forwards';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener('click', onClick);

    let scrolled = false;
    function onScroll() {
      if (!scrolled) {
        scrolled = true;
        document
          .querySelectorAll<HTMLElement>('.floating-element')
          .forEach((el, index) => {
            setTimeout(() => {
              el.style.animationPlayState = 'running';
            }, index * 200);
          });
      }
    }
    window.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
    return (
<section className="font-primary relative min-h-screen w-full overflow-hidden text-[#f5f2eb]">
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
                <div className="w-full overflow-auto lg:overflow-visible">
                    <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full dark:[--color-muted:var(--color-zinc-900)]">
                        <thead className="bg-background sticky top-0">
                            <tr className="*:py-4 *:text-left *:font-medium">
                                <th className="lg:w-2/5"></th>
                                <th className="space-y-3">
                                    <span className="block">المجاني</span>

                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">البدأ الان</Link>
                                    </Button>
                                </th>
                                <th className="bg-muted rounded-t-(--radius) space-y-3 px-4">
                                    <span className="block">احترافي</span>
                                    <Button
                                    disabled
                                        asChild
                                        size="sm">
                                        <Link href="#">قريبا</Link>
                                    </Button>
                                </th>
                                <th className="space-y-3">
                                    <span className="block">الشركات</span>
                                    <Button
                                        asChild
                                        disabled
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">قريبا</Link>
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-caption text-sm">
                           
                            <tr className="*:pb-3 *:pt-8">
                                <td className="flex items-center gap-2 font-medium">
                                    <Sparkles className="size-4" />
                                    <span>كل النماذج</span>
                                </td>
                                <td></td>
                                <td className="bg-muted border-none px-4"></td>
                                <td></td>
                            </tr>
                            {tableData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="*:border-b *:py-3">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td>
                                        {row.free === true ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            row.free
                                        )}
                                    </td>
                                    <td className="bg-muted border-none px-4">
                                        <div className="-mb-3 border-b py-3">
                                            {row.pro === true ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="size-4">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                row.pro
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {row.startup === true ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            row.startup
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="*:py-6">
                                <td></td>
                                <td></td>
                                <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}