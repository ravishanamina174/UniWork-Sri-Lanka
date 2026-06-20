import React from 'react';

export default function ShowcaseSection() {
  return (
    <>
      <style>
        {`
          .showcase-wrapper {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #6C42FF;
            background-image: 
              radial-gradient(circle at 85% -10%, rgba(212, 238, 121, 0.9) 0%, transparent 40%),
              radial-gradient(circle at 100% 110%, rgba(212, 238, 121, 0.9) 0%, transparent 45%),
              linear-gradient(135deg, #6C42FF 0%, #8352FF 100%);
            border-radius: 24px;
            display: flex;
            max-width: 1100px;
            margin: 0 auto;
            overflow: hidden;
            color: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
          }

          .showcase-content {
            padding: 4rem;
            width: 55%;
            box-sizing: border-box;
            z-index: 2;
          }

          .showcase-content h1 {
            font-size: 2.8rem;
            font-weight: 800;
            line-height: 1.1;
            margin: 0 0 1.2rem 0;
            letter-spacing: -0.03em;
          }

          .showcase-content > p {
            font-size: 1.05rem;
            line-height: 1.5;
            margin: 0 0 2rem 0;
            color: #F8F9FA;
            font-weight: 400;
            max-width: 95%;
          }

          .benefits-list {
            list-style: none;
            padding: 0;
            margin: 0 0 2.5rem 0;
          }

          .benefits-list li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.05rem;
            margin-bottom: 0.8rem;
            color: #ffffff;
            font-weight: 500;
          }

          .benefits-list svg {
            flex-shrink: 0;
          }

          .cta-text {
            font-weight: 700;
            font-size: 1.1rem;
            margin: 0 0 1rem 0;
          }

          .cta-button {
            background-color: #ffffff;
            color: #000000;
            border: none;
            padding: 0.8rem 1.2rem;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            transition: background-color 0.2s ease;
          }

          .cta-button:hover {
            background-color: #f0f0f0;
          }

          .showcase-graphics {
            width: 45%;
            position: relative;
            display: flex;
            justify-content: center;
          }

          .lanyard {
            position: absolute;
            top: 0;
            right: 30%;
            width: 32px;
            height: 160px;
            background-color: #1a1a1a;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 2px 0 10px rgba(0,0,0,0.2);
          }

          .lanyard span {
            color: #ffffff;
            transform: rotate(-90deg);
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 2px;
            white-space: nowrap;
          }

          .clip-ring {
            position: absolute;
            top: 160px;
            right: calc(30% + 16px);
            transform: translateX(50%);
            width: 20px;
            height: 35px;
            border: 3px solid #e0e0e0;
            border-radius: 10px;
            z-index: 9;
            background: transparent;
          }

          .clip-base {
            position: absolute;
            top: 195px;
            right: calc(30% + 16px);
            transform: translateX(50%);
            width: 10px;
            height: 15px;
            background-color: #d0d0d0;
            border-radius: 2px;
            z-index: 11;
          }

          .badge {
            position: absolute;
            width: 220px;
            height: 330px;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
            overflow: hidden;
          }

          .badge-back {
            background-color: #161616;
            top: 210px;
            right: 35%;
            transform: rotate(-18deg);
            z-index: 5;
            display: flex;
            align-items: center;
          }

          .badge-back .back-logo {
            color: #ffffff;
            transform: rotate(-90deg);
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 1px;
            margin-left: -1rem;
          }

          .badge-front {
            background-color: #ffffff;
            top: 210px;
            right: 15%;
            z-index: 8;
            display: flex;
            flex-direction: column;
            transform: rotate(2deg);
          }

          .badge-photo-placeholder {
            width: 100%;
            height: 200px;
            background-color: #2a2a2a; 
          }

          .badge-info {
            padding: 1.2rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            color: #000000;
          }

          .badge-info h2 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 600;
            line-height: 1.1;
            letter-spacing: -0.02em;
          }

          .badge-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            font-size: 0.55rem;
            color: #555555;
            font-weight: 500;
          }

          .badge-hole {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            background-color: #6C42FF; 
            border-radius: 50%;
            z-index: 20;
          }

          @media (max-width: 900px) {
            .showcase-wrapper {
              flex-direction: column;
            }
            .showcase-content {
              width: 100%;
              padding: 3rem;
            }
            .showcase-graphics {
              width: 100%;
              height: 450px;
            }
            .lanyard {
              right: 50%;
              transform: translateX(50%);
            }
            .clip-ring, .clip-base {
              right: 50%;
            }
            .badge-front {
              right: 50%;
              transform: translateX(50%) rotate(2deg);
            }
            .badge-back {
              right: 50%;
              transform: translateX(30%) rotate(-18deg);
            }
          }
        `}
      </style>

      <section className="showcase-wrapper">
        {/* Left Content */}
        <div className="showcase-content">
          <h1>Showcase Your Work, Get<br />Noticed!</h1>
          
          <p>Your projects deserve the spotlight! Share your best work, inspire others, and open doors to new opportunities. Whether you're a student or a pro, this is your stage to shine.</p>
          
          <ul className="benefits-list">
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 16 16 12 12 8" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Get visibility from recruiters & peers
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 16 16 12 12 8" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Build your portfolio & personal brand
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 16 16 12 12 8" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Connect with like-minded developers
            </li>
          </ul>

          <p className="cta-text">Let's put your work in front of the right people!</p>
          
          <button className="cta-button">Showcase Your Project</button>
        </div>

        {/* Right Graphics (Badges) */}
        <div className="showcase-graphics">
          <div className="lanyard">
            <span>NEXT UI</span>
          </div>
          <div className="clip-ring"></div>
          <div className="clip-base"></div>

          {/* Back Tilted Badge */}
          <div className="badge badge-back">
            <div className="back-logo">NEXT UI</div>
          </div>

          {/* Front Badge Profile */}
          <div className="badge badge-front">
            <div className="badge-hole"></div>
            
            {/* Image Placeholder (Replace background-color with your image later) */}
            <div className="badge-photo-placeholder"></div>
            
            <div className="badge-info">
              <h2>Kamesh<br />Chandima</h2>
              
              <div className="badge-footer">
                <span>Associate Software Engineer</span>
                <span>ID 0032</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}