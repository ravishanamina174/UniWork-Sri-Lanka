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
            min-height: 600px;
            background-color: #fafafa; /* Very subtle background distinction */
            border-right: 1px solid #f3f4f6;
          }

          /* Yellow Guarantee Tape */
          .guarantee-tape {
            position: absolute;
            top: 120px;
            left: 5%;
            background-color: #ccff00; /* Neon yellow matching screenshot */
            color: #000000;
            padding: 0.4rem 1.2rem;
            font-weight: 800;
            font-size: 1.1rem;
            transform: rotate(-12deg);
            border: 2px dashed #000000;
            z-index: 5; /* Behind lanyard */
            white-space: nowrap;
          }

          /* Lanyard */
          .ca-lanyard {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 180px;
            background-color: #1a1a1a;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 2px 0 10px rgba(0,0,0,0.15);
          }

          .ca-lanyard span {
            color: #ffffff;
            transform: rotate(-90deg);
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 2px;
            white-space: nowrap;
          }

          /* Clip */
          .ca-clip-ring {
            position: absolute;
            top: 180px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 35px;
            border: 3px solid #e0e0e0;
            border-radius: 10px;
            z-index: 9;
            background: transparent;
          }

          .ca-clip-base {
            position: absolute;
            top: 215px;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 15px;
            background-color: #d0d0d0;
            border-radius: 2px;
            z-index: 11;
          }

          /* Badges */
          .ca-badge {
            position: absolute;
            width: 220px;
            height: 330px;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
            overflow: hidden;
          }

          .ca-badge-back {
            background-color: #161616;
            top: 230px;
            left: 50%;
            transform: translateX(-75%) rotate(-18deg);
            z-index: 4;
            display: flex;
            align-items: center;
          }

          .ca-badge-back .back-logo {
            color: #ffffff;
            transform: rotate(-90deg);
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 1px;
            margin-left: -1rem;
          }

          .ca-badge-front {
            background-color: #ffffff;
            top: 230px;
            left: 50%;
            transform: translateX(-35%) rotate(2deg);
            z-index: 8;
            display: flex;
            flex-direction: column;
            border: 1px solid #f0f0f0;
          }

          .ca-badge-hole {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            background-color: #fafafa; 
            border-radius: 50%;
            z-index: 20;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          }

          .ca-badge-photo-placeholder {
            width: 100%;
            height: 200px;
            background-color: #2a2a2a; 
          }

          .ca-badge-info {
            padding: 1.2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            color: #000000;
          }

          .ca-badge-info h2 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 600;
            line-height: 1.1;
            letter-spacing: -0.02em;
          }

          .ca-badge-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            font-size: 0.55rem;
            color: #555555;
            font-weight: 500;
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
            .guarantee-tape {
              left: 50%;
              transform: translateX(-80%) rotate(-12deg);
            }
          }
        `}
      </style>

      <section className="career-wrapper">
        
        {/* Left Graphics (Badges & Tape) */}
        <div className="career-graphics">
          <div className="guarantee-tape">100% Job Guarantee</div>
          
          <div className="ca-lanyard">
            <span>NEXT UI</span>
          </div>
          <div className="ca-clip-ring"></div>
          <div className="ca-clip-base"></div>

          {/* Back Tilted Badge */}
          <div className="ca-badge ca-badge-back">
            <div className="back-logo">NEXT UI</div>
          </div>

          {/* Front Badge Profile */}
          <div className="ca-badge ca-badge-front">
            <div className="ca-badge-hole"></div>
            
            {/* Image Placeholder */}
            <div className="ca-badge-photo-placeholder"></div>
            
            <div className="ca-badge-info">
              <h2>Kamesh<br />Chandima</h2>
              
              <div className="ca-badge-footer">
                <span>Associate Software Engineer</span>
                <span>ID 0032</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="career-content">
          <div className="ca-pill">Land a Job or 100% Refund</div>
          
          <h2>100% Job Guarantee with Our Career Accelerator Track</h2>
          <h3>Exclusive Track for Top Performers – With a 95% Success Rate</h3>
          
          <p>
            No, this program isn't open for everyone. The Career Accelerator is an exclusive
            track, handpicked for the top-performing students of STEM Link. After
            completing one of our intensive bootcamps, a high-potential group is selected
            every 3 months to enter this elite program.
          </p>
          
          <p>
            The Career Accelerator isn't just about more learning, but it's about getting
            results. Students in this program receive advanced technical coaching, personal
            career mentoring, recruiter outreach support, and ongoing interview preparation
            until they land their job.
          </p>
          
          <p>
            We've proudly maintained a 95% success rate in placing our Career Accelerator
            students in top software companies, startups, and even overseas tech firms. For
            the few who make it in, this program becomes a fast track to employment in
            tech.
          </p>

          <div className="ca-read-more">
            Read more stories below
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

      </section>
    </>
  );
}