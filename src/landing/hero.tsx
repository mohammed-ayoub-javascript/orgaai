'use client';

import React, { useEffect, useRef } from 'react';

const colors = {
  50: '#f8f7f5',
  100: '#e6e1d7',
  200: '#c8b4a0',
  300: '#a89080',
  400: '#8a7060',
  500: '#6b5545',
  600: '#544237',
  700: '#3c4237',
  800: '#2a2e26',
  900: '#1a1d18',
};

export default function HeroSection() {
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
<div className="font-primary relative min-h-screen w-full overflow-hidden text-[#f5f2eb]">

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

<div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-8 py-12 md:px-16 md:py-20">
  <div className="text-center">
    <h2
      className="font-mono text-xs font-light tracking-[0.25em] uppercase opacity-80 md:text-sm"
      style={{ color: "#e5e1d4" }}
    >
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "0.2s" }}>الجيل</span>{" "}
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "0.4s" }}>التالي</span>{" "}
      <span className="inline-block animate-fadeInUp font-bold text-[#ffd700]" style={{ animationDelay: "0.6s" }}>للذكاء الاصطناعي</span>{" "}
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "0.8s" }}>في الجزائر</span>
    </h2>
  </div>

  <div className="mx-auto max-w-4xl text-center">
    <h1
      className="text-decoration text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight tracking-tight"
      style={{ color: "#fff" }}
    >
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "1s" }}>ترجمة</span>{" "}
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "1.2s" }}>النماذج الكبيرة</span>{" "}
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "1.4s" }}>للثقافة المحلية</span>
    </h1>
  </div>

  <div className="text-center">
    <h2
      className="font-mono text-xs font-light tracking-[0.25em] uppercase opacity-80 md:text-sm"
      style={{ color: "#e5e1d4" }}
    >
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "2s" }}>دعم</span>{" "}
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "2.2s" }}>القطاع المحلي</span>{" "}
      <span className="inline-block animate-fadeInUp" style={{ animationDelay: "2.4s" }}>بالتكنولوجيا الحديثة</span>
    </h2>
  </div>
</div>
</div>

  );
  
}
