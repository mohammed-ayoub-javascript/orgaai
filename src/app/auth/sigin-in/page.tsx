import SignIn from '@/components/auth/sign-in'
import React from 'react'

const SiginInPage = () => {
  return (
   <div className='  flex justify-center items-center flex-col w-full h-screen p-3'>

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
     <SignIn />
   </div>
  )
}

export default SiginInPage