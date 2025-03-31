import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import ball from '../assets/basketball.svg';

const DraggableBall: React.FC = () => {
  const controls = useAnimation();
  const ballRef = useRef<HTMLDivElement>(null);
  const size = 70;
  const [isThrown, setIsThrown] = useState(false);
  
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const simulationTimeoutRef = useRef<number>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const gravity = 2000;
  const bounceFactor = 0.3;

  const simulate = (timestamp: number, state: { x: number; y: number; vx: number; vy: number }) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    state.x += state.vx * dt;
    state.y += state.vy * dt + 0.5 * gravity * dt * dt;
    state.vy += gravity * dt;
    const parentRect = ballRef.current?.parentElement?.getBoundingClientRect();
    if (parentRect) {
      const leftBoundary = -parentRect.left;
      const rightBoundary = window.innerWidth - parentRect.left;
      if (state.x < leftBoundary) {
        state.x = leftBoundary;
        state.vx = -state.vx * bounceFactor;
      }
      if (state.x + size > rightBoundary) {
        state.x = rightBoundary - size;
        state.vx = -state.vx * bounceFactor;
      }
    }
    positionRef.current = { x: state.x, y: state.y };
    controls.set({ x: state.x, y: state.y });
    animationFrameRef.current = requestAnimationFrame((ts) => simulate(ts, state));
  };

  const resetBall = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    lastTimeRef.current = null;
    positionRef.current = { x: 0, y: 0 };
    controls.start({
      x: 0,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    });
    setIsThrown(false);
  };

  useEffect(() => {
    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    lastTimeRef.current = null;
    setIsThrown(true);
    const state = {
      x: positionRef.current.x,
      y: positionRef.current.y,
      vx: info.velocity.x,
      vy: info.velocity.y,
    };
    animationFrameRef.current = requestAnimationFrame((timestamp) => simulate(timestamp, state));
    simulationTimeoutRef.current = setTimeout(() => {
      resetBall();
    }, 2000);
  };

  return (
    <motion.div
      ref={ballRef}
      drag={!isThrown}
      dragMomentum={false}
      onDrag={(_, info) => {
        if (!isThrown) {
          const newX = info.offset.x;
          const newY = info.offset.y;
          positionRef.current = { x: newX, y: newY };
          controls.set({ x: newX, y: newY });
        }
      }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: 0, y: 0 }}
      style={{ cursor: isThrown ? 'default' : 'grab', touchAction: 'none', position: 'absolute' }}
    >
      <motion.img
        width={size}
        height={size}
        src={ball}
        draggable={false}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
      />
    </motion.div>
  );
};

export default DraggableBall;
