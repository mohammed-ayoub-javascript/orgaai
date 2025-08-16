"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Calendar, LucideIcon, MapIcon, MessageCircle, User } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'
import React, { useEffect, useRef } from 'react';

export default function Features() {
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
        <section className=" py-16 md:py-32 bg-transparent font-primary relative min-h-screen w-full overflow-hidden text-[#f5f2eb]">
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

            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={MessageCircle}
                                title="محادثة مع الذكاء الاصطناعي"
                                description="تواصل تحدث تفاعل مع الذكاء الاصطناعي باللهجة المحلية"
                            />
                        </CardHeader>

                        <div className="relative mb-6 border-t border-dashed sm:mb-0">
                            <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--color-white)_100%)]"></div>
                            <div className="aspect-76/59 p-1 px-6">
                                <DualModeImage
                                    darkSrc="/screen.png"
                                    alt="payments illustration"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={User}
                                title="تضمين الذكاء الاصطناعي للمهام"
                                description="يمكن للذكاء الاصطناعي مساعدتك في اداء المهام الروتينية بتطبيق مخصص لكل غرض من الاغراض"
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="relative mb-6 sm:mb-0">
                                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,var(--color-background)_100%)]"></div>
                                <div className="aspect-76/59 border">
                                    <DualModeImage
                                        darkSrc="/AI.png"
                                        lightSrc="/origin-cal.png"
                                        alt="calendar illustration"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc?: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <Image
            src={darkSrc}
            className={cn(' ', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
    
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-linear-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-linear-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)