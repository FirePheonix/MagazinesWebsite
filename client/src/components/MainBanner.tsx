import React, { useEffect, useRef, useState } from 'react';
import TechnoPark from "../assets/technopark.jpg";
import Rectangle1 from "@/assets/Rashtriya.jpg"
import Rectangle2 from "@/assets/Hackzilla.jpg";

const AnimatedBanner: React.FC = () => {
  const [count, setCount] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const headerRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const preLoaderRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderBgRef = useRef<HTMLDivElement>(null);
  const loader2Ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  // Start "Publications" animation immediately
  const animateText = () => {
    if (textRef.current) {
      const text = textRef.current.textContent || '';
      textRef.current.innerHTML = text.replace(/\S/g, "<span class='inline-block leading-4'>$&</span>");
      const letters = textRef.current.querySelectorAll('span');

      letters.forEach((letter, i) => {
        const span = letter as HTMLElement;
        span.style.transform = 'translateY(-100px)';
        span.style.transition = `transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)`;
        span.style.transitionDelay = `${30 * i}ms`;

        setTimeout(() => {
          span.style.transform = 'translateY(0px)';
        }, 50);

        setTimeout(() => {
          span.style.transform = 'translateY(100px)';
          span.style.transitionDelay = `${30 * i}ms`;
        }, 2000);
      });
    }
  };

  const animateCount = (): Promise<void> => {
    return new Promise((resolve) => {
      let currentValue = 0;
      const interval = setInterval(() => {
        currentValue += Math.floor(Math.random() * 8) + 2;
        if (currentValue >= 100) {
          currentValue = 100;
          setCount(currentValue);
          clearInterval(interval);
          resolve();
        } else {
          setCount(currentValue);
        }
      }, 50);
    });
  };

  const animateTimeline = () => {
    const timeline = [
      { element: countRef.current, delay: 500, duration: 250, props: { opacity: '0' } },
      { element: preLoaderRef.current, delay: 0, duration: 2000, props: { transform: 'scale(0.5)' } },
      { element: loaderRef.current, delay: 750, duration: 1500, props: { height: '0' } },
      { element: loaderBgRef.current, delay: 1000, duration: 1500, props: { height: '0' } },
      { element: loader2Ref.current, delay: 500, duration: 1500, props: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' } }
    ];

    timeline.forEach(({ element, delay, duration, props }) => {
      if (element) {
        setTimeout(() => {
          Object.entries(props).forEach(([key, value]) => {
            (element.style as any)[key] = value;
          });
          element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        }, delay);
      }
    });
  };

  const animateHeaders = () => {
    headerRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.style.transform = 'translateY(200px)';
        ref.style.transition = `transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        ref.style.transitionDelay = `${50 * i}ms`;
        setTimeout(() => {
          ref.style.transform = 'translateY(0)';
        }, 50);
      }
    });
    setShowContent(true);
  };

  const animateImages = () => {
    imageRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        ref.style.transition = `clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        ref.style.transitionDelay = `${250 * i}ms`;
      }
    });
  };

  const startAllAnimations = async () => {
    animateText();                // ⏪ Start this IMMEDIATELY with count
    await animateCount();         // Wait for count to reach 100
    animateTimeline();            // Trigger loader transitions
    setTimeout(() => animateHeaders(), 1750);
    setTimeout(() => animateImages(), 2500);
    setTimeout(() => setAnimationComplete(true), 3500);
  };

  startAllAnimations();
}, []);


  const letters = ['M', 'a', 'g', 'a', 'z', 'i', 'n', 'e'];

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Pre-loader - Hide completely after animation */}
      {!animationComplete && (
        <div 
          ref={preLoaderRef}
          className="fixed top-0 w-full h-full z-50"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        >
          {/* Main loader */}
          <div 
            ref={loaderRef}
            className="absolute top-0 w-full h-full bg-black text-white flex justify-center items-center z-10"
          >
            {/* Loader content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex w-96 z-20 text-white">
              <div ref={countRef} className="flex-[2] text-right leading-none pr-4">
                <p className="text-4xl font-bold">{count}</p>
              </div>
              <div className="flex-[6] text-3xl uppercase leading-none overflow-hidden">
                <p ref={textRef} className="font-serif">Publications</p>
              </div>
            </div>
          </div>

          {/* Loader background */}
          <div 
            ref={loaderBgRef}
            className="absolute top-0 w-full h-full bg-red-500 -z-10"
          />
        </div>
      )}

      {/* Second loader with TechnoPark background image - Hide completely after animation */}
      {!animationComplete && (
        <div 
          ref={loader2Ref}
          className="absolute top-0 w-full h-full -z-20"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            backgroundImage: `
              linear-gradient(to bottom right, rgba(76,29,149,0.7), rgba(30,58,138,0.7), rgba(49,46,129,0.7)),
              url(${TechnoPark}),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            backgroundSize: 'cover, cover, auto',
            backgroundRepeat: 'no-repeat, no-repeat, repeat',
            backgroundPosition: 'center, center, center',
            zIndex: -10,
          }}


        >
          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
      )}

      {/* Site content - Ensure it doesn't interfere with subsequent components */}
      <div className={`relative transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
           style={{ zIndex: 1 }}>

        {/* Main header */}
        <div className="flex p-4">
          {letters.map((letter, index) => (
            <h1
              key={index}
              ref={(el) => {
                if (headerRefs.current) {
                  headerRefs.current[index] = el;
                }
              }}
              className="flex-1 relative font-serif font-medium uppercase leading-none text-center flex justify-center items-center"
              style={{ 
                fontSize: '17vw',
                transform: 'translateY(200px)' // Start positioned below
              }}
            >
              {letter}
            </h1>
          ))}
        </div>

        {/* Background image */}

        {/* Down Content */}
        <div className="absolute w-full flex items-end p-8 max-md:flex-col max-md:gap-8">
          <div className="flex-1">
            <p className="w-1/2 text-sm leading-relaxed max-md:w-full">
              Indian Institute of Information Technology, Sonepat (IIIT, Sonepat) is one of the Indian Institutes of Information Technology located at Sonepat, Haryana.
            </p>
          </div>
          
          <div className="flex-1 flex gap-8 justify-end max-md:w-full max-md:justify-between">
            <div 
              ref={(el) => {
                if (imageRefs.current) {
                  imageRefs.current[0] = el;
                }
              }}
              className="w-56 h-36"
              style={{ 
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                backgroundImage: `url(${Rectangle1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div 
              ref={(el) => {
                if (imageRefs.current) {
                  imageRefs.current[1] = el;
                }
              }}
              className="w-56 h-36"
              style={{ 
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                backgroundImage: `url(${Rectangle2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBanner;