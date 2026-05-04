import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedChatbotIconProps {
  size?: number;
  isHovered?: boolean;
  isTalking?: boolean;
}

export const AnimatedChatbotIcon = ({
  size = 64,
  isHovered = false,
  isTalking = false,
}: AnimatedChatbotIconProps) => {
  const [blink, setBlink] = useState(false);

  // Random blinking
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000;
      return setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 180);
        timerId = scheduleBlink();
      }, delay);
    };
    let timerId = scheduleBlink();
    return () => clearTimeout(timerId);
  }, []);

  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  // Proportions based on size
  const headR = s * 0.34;
  const visorW = headR * 1.45;
  const visorH = headR * 0.55;
  const eyeR = headR * 0.14;
  const eyeSpacing = headR * 0.38;
  const bodyW = headR * 1.1;
  const bodyH = headR * 0.6;
  const neckY = cy + headR * 0.72;
  const bodyY = neckY + headR * 0.08;
  const armLen = headR * 0.55;
  const armW = headR * 0.12;
  const handR = headR * 0.11;
  const antennaH = headR * 0.28;

  const eyeY = cy - headR * 0.05;
  const eyeBlinkScaleY = blink ? 0.1 : 1;

  return (
    <motion.svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.5))" }}
    >
      <defs>
        {/* Neon glow ring gradient */}
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8ecf0" />
          <stop offset="100%" stopColor="#b8c4d0" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2332" />
          <stop offset="100%" stopColor="#0d1520" />
        </linearGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#60d5ff" />
          <stop offset="100%" stopColor="#00b4ff" />
        </radialGradient>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d4a7a" />
          <stop offset="100%" stopColor="#1a6bb5" />
        </linearGradient>
      </defs>

      {/* Rotating neon ring behind robot */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={s * 0.46}
        stroke="url(#ringGrad)"
        strokeWidth={s * 0.035}
        fill="none"
        opacity={0.8}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Antenna */}
      <line
        x1={cx}
        y1={cy - headR - antennaH}
        x2={cx}
        y2={cy - headR + 2}
        stroke="#c0cad4"
        strokeWidth={armW * 0.6}
        strokeLinecap="round"
      />
      <motion.circle
        cx={cx}
        cy={cy - headR - antennaH}
        r={headR * 0.08}
        fill="#00d4ff"
        filter="url(#neonGlow)"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Ear accents */}
      <rect
        x={cx - headR - headR * 0.12}
        y={cy - headR * 0.15}
        width={headR * 0.14}
        height={headR * 0.3}
        rx={headR * 0.05}
        fill="#a0b0c0"
      />
      <rect
        x={cx + headR - headR * 0.02}
        y={cy - headR * 0.15}
        width={headR * 0.14}
        height={headR * 0.3}
        rx={headR * 0.05}
        fill="#a0b0c0"
      />

      {/* Head */}
      <circle cx={cx} cy={cy} r={headR} fill="url(#bodyGrad)" />
      {/* Head subtle lines */}
      <path
        d={`M ${cx - headR * 0.6} ${cy - headR * 0.7} Q ${cx} ${cy - headR * 0.85} ${cx + headR * 0.6} ${cy - headR * 0.7}`}
        stroke="#c8d4de"
        strokeWidth={0.5}
        fill="none"
        opacity={0.5}
      />

      {/* Visor */}
      <rect
        x={cx - visorW / 2}
        y={eyeY - visorH / 2}
        width={visorW}
        height={visorH}
        rx={visorH / 2}
        fill="url(#visorGrad)"
        stroke="#2a3a4a"
        strokeWidth={0.5}
      />
      {/* Visor reflection */}
      <rect
        x={cx - visorW / 2 + visorW * 0.1}
        y={eyeY - visorH / 2 + visorH * 0.12}
        width={visorW * 0.35}
        height={visorH * 0.15}
        rx={visorH * 0.08}
        fill="white"
        opacity={0.08}
      />

      {/* Eyes */}
      <motion.g
        animate={{ scaleY: eyeBlinkScaleY }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: `${cx - eyeSpacing}px ${eyeY}px` }}
      >
        <motion.ellipse
          cx={cx - eyeSpacing}
          cy={eyeY}
          rx={eyeR}
          ry={eyeR}
          fill="url(#eyeGlow)"
          filter="url(#neonGlow)"
          animate={
            isHovered
              ? { rx: [eyeR, eyeR * 1.2, eyeR], ry: [eyeR, eyeR * 1.2, eyeR] }
              : {}
          }
          transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        />
      </motion.g>

      <motion.g
        animate={{ scaleY: eyeBlinkScaleY }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: `${cx + eyeSpacing}px ${eyeY}px` }}
      >
        <motion.ellipse
          cx={cx + eyeSpacing}
          cy={eyeY}
          rx={eyeR}
          ry={eyeR}
          fill="url(#eyeGlow)"
          filter="url(#neonGlow)"
          animate={
            isHovered
              ? { rx: [eyeR, eyeR * 1.2, eyeR], ry: [eyeR, eyeR * 1.2, eyeR] }
              : {}
          }
          transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        />
      </motion.g>

      {/* Eye smile curves when hovered */}
      {isHovered && (
        <>
          <motion.path
            d={`M ${cx - eyeSpacing - eyeR * 0.7} ${eyeY + eyeR * 0.3} Q ${cx - eyeSpacing} ${eyeY + eyeR * 1.2} ${cx - eyeSpacing + eyeR * 0.7} ${eyeY + eyeR * 0.3}`}
            stroke="#00d4ff"
            strokeWidth={1}
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.path
            d={`M ${cx + eyeSpacing - eyeR * 0.7} ${eyeY + eyeR * 0.3} Q ${cx + eyeSpacing} ${eyeY + eyeR * 1.2} ${cx + eyeSpacing + eyeR * 0.7} ${eyeY + eyeR * 0.3}`}
            stroke="#00d4ff"
            strokeWidth={1}
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        </>
      )}

      {/* Neck */}
      <rect
        x={cx - headR * 0.15}
        y={neckY - 2}
        width={headR * 0.3}
        height={headR * 0.15}
        rx={2}
        fill="#8a9aaa"
      />
      {/* Neck ring */}
      <ellipse
        cx={cx}
        cy={neckY}
        rx={headR * 0.22}
        ry={headR * 0.04}
        fill="#b8a050"
      />

      {/* Body */}
      <rect
        x={cx - bodyW / 2}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={bodyH * 0.3}
        fill="url(#bodyGrad)"
      />
      {/* Body details - chest dots */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`dot-${i}`}
          x={cx - headR * 0.2 + i * headR * 0.15}
          y={bodyY + bodyH * 0.3}
          width={headR * 0.06}
          height={headR * 0.04}
          rx={1}
          fill="#1a6bb5"
        />
      ))}

      {/* Belly hemisphere */}
      <path
        d={`M ${cx - bodyW * 0.4} ${bodyY + bodyH}
            Q ${cx - bodyW * 0.4} ${bodyY + bodyH + bodyH * 0.45} ${cx} ${bodyY + bodyH + bodyH * 0.45}
            Q ${cx + bodyW * 0.4} ${bodyY + bodyH + bodyH * 0.45} ${cx + bodyW * 0.4} ${bodyY + bodyH}
            Z`}
        fill="url(#bellyGrad)"
      />
      {/* Belly LED dots */}
      {isTalking && (
        <motion.g
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`led-${i}`}
              cx={cx - headR * 0.15 + i * headR * 0.1}
              cy={bodyY + bodyH + bodyH * 0.2}
              r={1.2}
              fill="#00d4ff"
            />
          ))}
        </motion.g>
      )}

      {/* Left arm */}
      <motion.g
        style={{ transformOrigin: `${cx - bodyW / 2}px ${bodyY + bodyH * 0.15}px` }}
        animate={
          isHovered
            ? { rotate: [0, -15, 5, -10, 0] }
            : { rotate: [0, -5, 0, -3, 0] }
        }
        transition={{
          duration: isHovered ? 1.2 : 3,
          repeat: Infinity,
          repeatDelay: isHovered ? 0.3 : 1,
        }}
      >
        <rect
          x={cx - bodyW / 2 - armLen}
          y={bodyY + bodyH * 0.1}
          width={armLen}
          height={armW}
          rx={armW / 2}
          fill="#c0cad4"
        />
        {/* Left hand */}
        <circle
          cx={cx - bodyW / 2 - armLen}
          cy={bodyY + bodyH * 0.1 + armW / 2}
          r={handR}
          fill="#a0b0c0"
          stroke="#8a9aaa"
          strokeWidth={0.5}
        />
        {/* Fingers */}
        <circle
          cx={cx - bodyW / 2 - armLen - handR * 0.6}
          cy={bodyY + bodyH * 0.1}
          r={handR * 0.4}
          fill="#a0b0c0"
        />
        <circle
          cx={cx - bodyW / 2 - armLen - handR * 0.6}
          cy={bodyY + bodyH * 0.1 + armW}
          r={handR * 0.4}
          fill="#a0b0c0"
        />
      </motion.g>

      {/* Right arm - waving */}
      <motion.g
        style={{ transformOrigin: `${cx + bodyW / 2}px ${bodyY + bodyH * 0.15}px` }}
        animate={
          isHovered
            ? { rotate: [0, 20, -10, 25, -5, 15, 0] }
            : { rotate: [0, 8, 0, 5, 0] }
        }
        transition={{
          duration: isHovered ? 1.5 : 3.5,
          repeat: Infinity,
          repeatDelay: isHovered ? 0.2 : 1.5,
        }}
      >
        <rect
          x={cx + bodyW / 2}
          y={bodyY + bodyH * 0.1}
          width={armLen}
          height={armW}
          rx={armW / 2}
          fill="#c0cad4"
        />
        {/* Right hand */}
        <circle
          cx={cx + bodyW / 2 + armLen}
          cy={bodyY + bodyH * 0.1 + armW / 2}
          r={handR}
          fill="#a0b0c0"
          stroke="#8a9aaa"
          strokeWidth={0.5}
        />
        {/* Fingers */}
        <circle
          cx={cx + bodyW / 2 + armLen + handR * 0.6}
          cy={bodyY + bodyH * 0.1}
          r={handR * 0.4}
          fill="#a0b0c0"
        />
        <circle
          cx={cx + bodyW / 2 + armLen + handR * 0.6}
          cy={bodyY + bodyH * 0.1 + armW}
          r={handR * 0.4}
          fill="#a0b0c0"
        />
      </motion.g>
    </motion.svg>
  );
};
