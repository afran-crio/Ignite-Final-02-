import type { ElementType, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Stagger, in ms, applied as a transition-delay. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/** Wraps children in the entrance animation. See src/lib/useReveal.ts. */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: RevealProps) {
  return (
    <Tag
      className={`reveal ${className}`.trim()}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
