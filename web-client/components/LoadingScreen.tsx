"use client";

import { useEffect, useRef, useState } from "react";

type LoadingScreenProps = {
  /** Time the loader stays on screen before fading out (ms). */
  duration?: number;
  /** Called after the exit fade finishes. Unmount the loader here. */
  onComplete?: () => void;
};

const EXIT_MS = 500;
const LETTERS = "UniWorkSL".split("");

export default function LoadingScreen({
  duration = 3000,
  onComplete,
}: LoadingScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const exitTimer = setTimeout(() => setExiting(true), duration);
    const doneTimer = setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setDone(true);
      completeRef.current?.();
    }, duration + EXIT_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [duration]);

  if (done) return null;

  return (
    <div
      className={`uw-loader${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading UniWorkSL"
    >
      <div className="uw-brand" aria-hidden="true">
        <CubeLogo />
        <div className="uw-wordmark">
          {LETTERS.map((char, i) => (
            <span
              key={i}
              className="uw-letter"
              style={{ ["--i" as string]: i }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .uw-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background: #000;
          color: #fff;
          font-family: var(--font-geist-sans), "Inter", system-ui, -apple-system, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          transition: opacity ${EXIT_MS}ms ease, visibility 0s linear ${EXIT_MS}ms;
        }
        .uw-loader.is-exiting {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .uw-brand {
          display: flex;
          align-items: center;
          gap: 0.3em;
          font-size: clamp(2.6rem, 9.5vw, 6.5rem);
          opacity: 0;
          animation: uwIn 600ms ease-out 100ms forwards;
        }

        .uw-logo {
          width: 1.05em;
          height: 1.05em;
          flex: none;
        }

        .uw-wordmark {
          display: flex;
          font-weight: 600;
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .uw-letter {
          display: inline-block;
          will-change: transform;
          animation: uwJump 1.5s cubic-bezier(0.45, 0, 0.25, 1) calc(0.35s + var(--i) * 85ms) 2;
        }

        @keyframes uwIn {
          to { opacity: 1; }
        }

        @keyframes uwJump {
          0%   { transform: translateY(0); }
          22%  { transform: translateY(-0.2em); }
          46%  { transform: translateY(0); }
          100% { transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .uw-letter { animation: none; }
          .uw-brand  { animation-duration: 0.01ms; animation-delay: 0s; }
        }
      `}</style>
    </div>
  );
}

function CubeLogo() {
  return (
    <svg
      className="uw-logo"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10L85 28V72L50 90L15 72V28L50 10Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M15 28L50 48L85 28"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M50 48V90"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M62 43V60C62 65 73 65 73 60V38"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}