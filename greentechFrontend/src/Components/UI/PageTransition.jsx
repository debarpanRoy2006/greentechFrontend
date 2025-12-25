import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './PageTransition.css';

const PageTransition = () => {
  const location = useLocation();
  const topRef = useRef(null);
  const botRef = useRef(null);

  useEffect(() => {
    // This runs every time the route (URL) changes
    const tl = gsap.timeline();

    // 1. Force shutters to CLOSE (Cover screen) immediately
    // We start from 'open' (0 height) and go to 'closed' (50vh height)
    tl.set([topRef.current, botRef.current], { height: '0vh' }) 
      .to([topRef.current, botRef.current], { 
        height: '50vh', 
        duration: 0.4, 
        ease: 'power2.out' 
      })
      // 2. Wait a tiny bit while the new page renders underneath
      .to([topRef.current, botRef.current], { 
        height: '0vh', 
        duration: 0.8, 
        ease: 'power2.inOut',
        delay: 0.2 
      });

  }, [location]); // Dependency array: triggers on location change

  return (
    <>
      <div ref={topRef} className="global-shutter top"></div>
      <div ref={botRef} className="global-shutter bottom"></div>
    </>
  );
};

export default PageTransition;