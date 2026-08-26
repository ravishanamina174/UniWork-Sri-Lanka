"use client";

import React, { useEffect } from "react";

export default function UniworkWatermark() {
  useEffect(() => {
    let ticking = false;

    const updateUniworkShine = () => {
      const scrollTop = window.scrollY;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        maxScroll > 0
          ? Math.min(Math.max(scrollTop / maxScroll, 0), 1)
          : 0;

      /*
        Move silver shine from left -> right
        based on page scroll position.
      */
      const shinePosition = -15 + progress * 130;

      document.documentElement.style.setProperty(
        "--uniwork-shine-x",
        `${shinePosition}%`
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateUniworkShine);
        ticking = true;
      }
    };

    updateUniworkShine();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <style>
        {`
          /* ==========================================
             UNIWORK MODERN SILVER SCROLL SHINE
             ========================================== */

          .uniwork-watermark {
            position: absolute;
            bottom: 0;
            left: 0;

            width: 100%;

            overflow: hidden;

            display: flex;
            justify-content: center;
            align-items: flex-end;

            z-index: 0;

            pointer-events: none;
            user-select: none;
          }

          /*
            Very subtle base UNIWORK.
          */
          .uniwork-base {
            position: relative;

            margin: 0;
            padding: 0;

            font-size: 20vw;
            line-height: 1;

            font-weight: 900;
            letter-spacing: -0.05em;

            white-space: nowrap;

            color: #0f172a;

            opacity: 0.035;

            z-index: 1;
          }

          /*
            Main SILVER diagonal shine.

            The silver line is intentionally narrow
            and tilted to the right.

            Because of background-clip:text,
            the shine is visible ONLY inside
            the UNIWORK letters.
          */
          .uniwork-shine {
            position: absolute;

            margin: 0;
            padding: 0;

            font-size: 20vw;
            line-height: 1;

            font-weight: 900;
            letter-spacing: -0.05em;

            white-space: nowrap;

            color: transparent;

            /*
              Diagonal silver beam.
              No gold colors.
            */
            background: linear-gradient(
              112deg,
              transparent 0%,

              transparent calc(var(--uniwork-shine-x, -15%) - 4%),

              rgba(170, 170, 170, 0.05)
                calc(var(--uniwork-shine-x, -15%) - 3%),

              rgba(205, 205, 205, 0.35)
                calc(var(--uniwork-shine-x, -15%) - 1.5%),

              rgba(245, 245, 245, 0.95)
                calc(var(--uniwork-shine-x, -15%) - 0.45%),

              rgba(255, 255, 255, 1)
                var(--uniwork-shine-x, -15%),

              rgba(215, 215, 215, 0.9)
                calc(var(--uniwork-shine-x, -15%) + 0.45%),

              rgba(160, 160, 160, 0.28)
                calc(var(--uniwork-shine-x, -15%) + 1.5%),

              rgba(255, 255, 255, 0.04)
                calc(var(--uniwork-shine-x, -15%) + 3%),

              transparent
                calc(var(--uniwork-shine-x, -15%) + 4%)
            );

            background-repeat: no-repeat;
            background-size: 100% 100%;

            /*
              Critical text clipping.
            */
            -webkit-background-clip: text;
            background-clip: text;

            -webkit-text-fill-color: transparent;

            opacity: 1;

            filter: blur(0.15px);

            z-index: 3;

            pointer-events: none;
          }

          /*
            Secondary soft silver glow.
            This follows the main line and remains
            clipped inside the text.
          */
          .uniwork-shine-glow {
            position: absolute;

            margin: 0;
            padding: 0;

            font-size: 20vw;
            line-height: 1;

            font-weight: 900;
            letter-spacing: -0.05em;

            white-space: nowrap;

            color: transparent;

            background: linear-gradient(
              112deg,
              transparent 0%,

              transparent calc(var(--uniwork-shine-x, -15%) - 7%),

              rgba(190, 190, 190, 0.03)
                calc(var(--uniwork-shine-x, -15%) - 5%),

              rgba(220, 220, 220, 0.18)
                calc(var(--uniwork-shine-x, -15%) - 3%),

              rgba(245, 245, 245, 0.3)
                var(--uniwork-shine-x, -15%),

              rgba(180, 180, 180, 0.12)
                calc(var(--uniwork-shine-x, -15%) + 3%),

              transparent
                calc(var(--uniwork-shine-x, -15%) + 7%)
            );

            background-repeat: no-repeat;
            background-size: 100% 100%;

            -webkit-background-clip: text;
            background-clip: text;

            -webkit-text-fill-color: transparent;

            filter: blur(4px);

            opacity: 0.9;

            z-index: 2;

            pointer-events: none;
          }

          /*
            Thin diagonal highlight core.
          */
          .uniwork-shine-core {
            position: absolute;

            margin: 0;
            padding: 0;

            font-size: 20vw;
            line-height: 1;

            font-weight: 900;
            letter-spacing: -0.05em;

            white-space: nowrap;

            color: transparent;

            background: linear-gradient(
              112deg,
              transparent 0%,

              transparent calc(var(--uniwork-shine-x, -15%) - 0.8%),

              rgba(255, 255, 255, 0.2)
                calc(var(--uniwork-shine-x, -15%) - 0.35%),

              rgba(255, 255, 255, 1)
                var(--uniwork-shine-x, -15%),

              rgba(225, 225, 225, 0.85)
                calc(var(--uniwork-shine-x, -15%) + 0.35%),

              transparent
                calc(var(--uniwork-shine-x, -15%) + 0.8%)
            );

            background-repeat: no-repeat;
            background-size: 100% 100%;

            -webkit-background-clip: text;
            background-clip: text;

            -webkit-text-fill-color: transparent;

            filter: blur(0.5px);

            opacity: 0.95;

            z-index: 4;

            pointer-events: none;
          }

          /* Desktop sizing */
          @media (min-width: 768px) {
            .uniwork-base,
            .uniwork-shine,
            .uniwork-shine-glow,
            .uniwork-shine-core {
              font-size: 16vw;
            }
          }

          /* Accessibility */
          @media (prefers-reduced-motion: reduce) {
            .uniwork-shine,
            .uniwork-shine-glow,
            .uniwork-shine-core {
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="uniwork-watermark">
        {/* Base UNIWORK */}
        <h1 className="uniwork-base">
          UNIWORK
        </h1>

        {/* Soft silver glow */}
        <h1
          className="uniwork-shine-glow"
          aria-hidden="true"
        >
          UNIWORK
        </h1>

        {/* Main diagonal silver line */}
        <h1
          className="uniwork-shine"
          aria-hidden="true"
        >
          UNIWORK
        </h1>

        {/* Bright silver core */}
        <h1
          className="uniwork-shine-core"
          aria-hidden="true"
        >
          UNIWORK
        </h1>
      </div>
    </>
  );
}