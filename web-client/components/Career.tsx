import React from 'react';

export default function Career() {
  return (
    <>
      <style>
        {`
          .career-wrapper {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #ffffff;
            border-radius: 24px;
            display: flex;
            max-width: 1100px;
            margin: 0 auto;
            overflow: hidden;
            color: #111827;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border: 1px solid #f3f4f6;
            position: relative;
            align-items: stretch;
          }

          /* --- Left Graphics Column --- */
          .career-graphics {
            width: 45%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 600px;
            background-color: #fafafa; /* Very subtle background distinction kept same */
            border-right: 1px solid #f3f4f6;
            padding: 0; /* Padding removed to allow full space image display */
            box-sizing: border-box;
          }

          .career-inserted-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 24px 0 0 24px; /* Left side matches the parent wrapper shape exactly */
          }

          /* --- Right Content Column --- */
          .career-content {
            padding: 4.5rem 4.5rem 4.5rem 3rem;
            width: 55%;
            box-sizing: border-box;
            z-index: 2;
          }

          .ca-pill {
            display: inline-block;
            border: 1px solid #d1d5db;
            border-radius: 9999px;
            padding: 0.35rem 1.2rem;
            font-size: 0.85rem;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 1.5rem;
            background-color: #ffffff;
          }

          .career-content h2 {
            font-size: 2.6rem;
            font-weight: 800;
            line-height: 1.1;
            margin: 0 0 1rem 0;
            letter-spacing: -0.03em;
            color: #111827;
          }

          .career-content h3 {
            font-size: 1.1rem;
            font-weight: 500;
            color: #374151;
            margin: 0 0 2rem 0;
          }

          .career-content p {
            font-size: 0.95rem;
            line-height: 1.6;
            margin: 0 0 1.2rem 0;
            color: #6b7280;
          }

          .ca-read-more {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            color: #6b7280;
            font-size: 0.9rem;
            font-weight: 500;
            margin-top: 1.5rem;
            cursor: pointer;
            transition: color 0.2s ease;
          }

          .ca-read-more:hover {
            color: #111827;
          }

          /* Mobile Responsiveness ensuring layout fixes apply across all components */
          @media (max-width: 900px) {
            .career-wrapper {
              flex-direction: column;
            }
            .career-content {
              width: 100%;
              padding: 3rem 2rem;
              order: 1; /* Places text on top for better mobile reading */
            }
            .career-graphics {
              width: 100%;
              height: 550px;
              min-height: auto;
              order: 2;
              border-right: none;
              border-top: 1px solid #f3f4f6;
              overflow: hidden;
            }
            .career-inserted-img {
              border-radius: 0 0 24px 24px; /* Adjusts corners nicely when stacked vertically on mobile */
            }
          }
        `}
      </style>

      <section className="career-wrapper">
        
        {/* Left Graphics Area with Full-bleed Grass Image */}
        <div className="career-graphics">
          <img 
            src="/assets/grass.jpg" 
            alt="Grass background" 
            className="career-inserted-img"
          />
        </div>

        {/* Right Content */}
        <div className="career-content">
          <div className="ca-pill">The First Dedicated Student Task Network in Sri Lanka</div>
          
          <h2>Bridging the Gap Between Flexible Student Income and On-Demand Help</h2>
          <h3>The Ultimate Solution for On-Campus Help, Skilled Digital Work, and Trusted Earnings</h3>
          
          <p>
            University students always need extra money, but regular part-time jobs do not work because 
            timetables change constantly from week to week. On the other side, regular people and local 
            businesses find it really hard to find quick, trustworthy help for hands-on tasks like moving 
            items, running errands, or event setup. Right now, there is absolutely no single, trusted website 
            in Sri Lanka built to bring these two sides together and fix this problem.
          </p>
          
          <p>
            UniWorkSL fixes this by focusing heavily on quick, physical tasks around the campus area—like 
            lifting lab equipment, helping at events, or local deliveries—while also offering digital 
            freelance work like simple design or typing tasks. Unlike confusing social media groups or big, 
            corporate job boards that take weeks to reply, UniWorkSL is fast, completely local, and fits 
            perfectly around a student's daily class hours.
          </p>
          
          <p>
            To keep everyone 100% safe, every student goes through an official profile check using their 
            university details before they can accept any work. Our main goal is to help students support 
            themselves financially while making campus life easier for everyone. We keep the platform running 
            by taking just a very small, clear service fee only after a job is successfully finished and the 
            student gets paid. It is a worry-free system where everyone wins.
          </p>

          <div className="ca-read-more">
            Read more details below
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

      </section>
    </>
  );
}