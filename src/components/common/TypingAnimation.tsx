import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  roles?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const DEFAULT_ROLES = [
  'Backend Engineer',
  'System Architecture',
  'API Development',
  'Database Engineering',
  'AI Engineering',
];

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  roles = DEFAULT_ROLES,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2200,
  className = '',
}) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentText(roles[roleIndex]);
      const timer = setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    const currentTarget = roles[roleIndex];

    if (!isDeleting) {
      if (currentText.length < currentTarget.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }
  }, [currentText, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseDuration, prefersReducedMotion]);

  // Find maximum length among roles to prevent layout shifting
  const maxRoleLength = Math.max(...roles.map((r) => r.length));

  return (
    <span
      className={`inline-flex items-center font-mono tracking-tight text-white/90 select-none ${className}`}
      style={{ minWidth: `${maxRoleLength * 0.6}ch` }}
      aria-label={`Specializing in ${roles[roleIndex]}`}
    >
      <span className="whitespace-pre">{currentText}</span>
      <span
        className="inline-block w-[2px] h-[1.15em] ml-1 bg-white align-middle animate-[pulse_1s_infinite]"
        aria-hidden="true"
      />
    </span>
  );
};
