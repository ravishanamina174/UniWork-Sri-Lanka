
"use client";

import { useEffect, useRef, useState } from "react";

type LoadingScreenProps = {
  duration?: number;
  onComplete?: () => void;
};

const EXIT_MS = 650;
const LETTERS = "UniWorkSL".split("");

export default function LoadingScreen({
  duration = 2500,
  onComplete,
}: LoadingScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const completeRef = useRef(onComplete);

  completeRef.current = onComplete;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, duration);

    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setDone(true);
      completeRef.current?.();
    }, duration + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [duration]);

  if (done) return null;

  return (
    <div
      className={`uw-loader${exiting ? " is-exiting" : ""}`}
      style={{ "--exit-ms": `${EXIT_MS}ms` } as React.CSSProperties}
      role="status"
      aria-live="polite"
      aria-label="Loading UniWorkSL"
    >
      <div className="uw-brand" aria-hidden="true">
        <CubeLogo />

        <div className="uw-wordmark">
          {LETTERS.map((char, i) => (
            <span
              key={`${char}-${i}`}
              className="uw-letter"
              style={{ "--i": i } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .uw-loader {
          --uw-bg: #000000;
          --uw-fg: #ffffff;

          position: fixed;
          inset: 0;
          z-index: 99999;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: var(--uw-bg);
          color: var(--uw-fg);
          isolation: isolate;

          font-family: var(--font-geist-sans), "Inter",
            system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif;

          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;

          opacity: 1;
          visibility: visible;
          pointer-events: auto;

          transition:
            opacity var(--exit-ms, 650ms)
              cubic-bezier(0.65, 0, 0.35, 1),
            visibility 0s linear 0s;
        }

        /* System light theme, unless an explicit dark class is set. */
        @media (prefers-color-scheme: light) {
          html:not(.dark) .uw-loader {
            --uw-bg: #ffffff;
            --uw-fg: #000000;
          }
        }

        /* Explicit theme classes take precedence. */
        html.light .uw-loader {
          --uw-bg: #ffffff;
          --uw-fg: #000000;
        }

        html.dark .uw-loader {
          --uw-bg: #000000;
          --uw-fg: #ffffff;
        }

        .uw-brand {
          display: flex;
          align-items: center;
          gap: 0.3em;
          font-size: clamp(2.6rem, 9.5vw, 6.5rem);
          font-weight: 600;
          line-height: 1;
          transform-origin: center;
          will-change: transform, opacity;

          opacity: 0;
          transform: translateY(12px) scale(0.97);

          animation: uwBrandIn 700ms
            cubic-bezier(0.16, 1, 0.3, 1) 80ms forwards;
        }

        .uw-logo {
          width: 1.05em;
          height: 1.05em;
          flex: none;
          overflow: visible;
          color: inherit;
        }

        .uw-wordmark {
          display: flex;
          align-items: baseline;
          white-space: nowrap;
          font-weight: 650;
          letter-spacing: -0.06em;
          line-height: 1;
        }

        .uw-letter {
          display: inline-block;
          transform-origin: center bottom;
          will-change: transform;
          animation: uwLetterMotion 1.5s
            cubic-bezier(0.45, 0, 0.25, 1)
            calc(0.35s + var(--i) * 85ms) 2 both;
        }

        .uw-cube-line {
          stroke: currentColor;
          stroke-width: 7;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }

        /* Smoothly reveal the already-rendered homepage. */
        .uw-loader.is-exiting {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;

          transition:
            opacity var(--exit-ms, 650ms)
              cubic-bezier(0.65, 0, 0.35, 1),
            visibility 0s linear var(--exit-ms, 650ms);
        }

        .uw-loader.is-exiting .uw-brand {
          animation: uwBrandOut var(--exit-ms, 650ms)
            cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .uw-loader.is-exiting .uw-letter {
          animation: uwLetterOut 400ms
            cubic-bezier(0.55, 0, 1, 0.45)
            calc(var(--i) * 18ms) both;
        }

        @keyframes uwBrandIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes uwLetterMotion {
          0%, 100% {
            transform: translateY(0);
          }
          22% {
            transform: translateY(-0.2em);
          }
          46% {
            transform: translateY(0);
          }
        }

        @keyframes uwBrandOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          45% {
            opacity: 0.75;
            transform: scale(0.97);
          }
          100% {
            opacity: 0;
            transform: scale(1.025);
          }
        }

        @keyframes uwLetterOut {
          to {
            opacity: 0;
            transform: translateY(-0.12em) scale(0.97);
          }
        }

        @media (max-width: 480px) {
          .uw-brand {
            font-size: clamp(2rem, 10vw, 3.2rem);
            gap: 0.22em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .uw-brand,
          .uw-letter {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .uw-loader,
          .uw-loader.is-exiting {
            transition:
              opacity 150ms ease,
              visibility 0s linear 150ms;
          }

          .uw-loader.is-exiting .uw-brand,
          .uw-loader.is-exiting .uw-letter {
            animation: none;
          }
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
        className="uw-cube-line"
        d="M50 10L85 28V72L50 90L15 72V28L50 10Z"
      />

      <path
        className="uw-cube-line"
        d="M15 28L50 48L85 28"
      />

      <path
        className="uw-cube-line"
        d="M50 48V90"
      />

      <path
        className="uw-cube-line"
        strokeWidth="6"
        d="M62 43V60C62 65 73 65 73 60V38"
      />
    </svg>
  );
}
