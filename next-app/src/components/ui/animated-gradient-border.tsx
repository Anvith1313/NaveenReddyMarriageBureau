import React, { CSSProperties, ReactNode, HTMLAttributes } from 'react';

type AnimationMode = 'auto-rotate' | 'rotate-on-hover' | 'stop-rotate-on-hover';

interface BorderRotateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  className?: string;
  animationMode?: AnimationMode;
  animationSpeed?: number;
  gradientColors?: { primary: string; secondary: string; accent: string };
  backgroundColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  style?: CSSProperties;
}

/** NRMB brand defaults: deep rose → champagne gold → pale gold */
const defaultGradientColors = {
  primary: '#7B1E3C',
  secondary: '#C8A24A',
  accent: '#EDD898',
};

const BorderRotate: React.FC<BorderRotateProps> = ({
  children,
  className = '',
  animationMode = 'auto-rotate',
  animationSpeed = 6,
  gradientColors = defaultGradientColors,
  backgroundColor = '#FFFDF8',
  borderWidth = 2,
  borderRadius = 12,
  style = {},
  ...props
}) => {
  const animClass =
    animationMode === 'auto-rotate'
      ? 'gradient-border-auto'
      : animationMode === 'rotate-on-hover'
      ? 'gradient-border-hover'
      : 'gradient-border-stop-hover';

  const combinedStyle: CSSProperties = {
    '--gradient-primary': gradientColors.primary,
    '--gradient-secondary': gradientColors.secondary,
    '--gradient-accent': gradientColors.accent,
    '--bg-color': backgroundColor,
    '--border-width': `${borderWidth}px`,
    '--border-radius': `${borderRadius}px`,
    '--animation-duration': `${animationSpeed}s`,
    border: `${borderWidth}px solid transparent`,
    borderRadius: `${borderRadius}px`,
    backgroundImage: `
      linear-gradient(${backgroundColor}, ${backgroundColor}),
      conic-gradient(
        from var(--gradient-angle, 0deg),
        ${gradientColors.primary} 0%,
        ${gradientColors.secondary} 25%,
        ${gradientColors.accent}   35%,
        ${gradientColors.secondary} 45%,
        ${gradientColors.primary} 55%,
        ${gradientColors.secondary} 75%,
        ${gradientColors.accent}   85%,
        ${gradientColors.secondary} 90%,
        ${gradientColors.primary} 100%
      )
    `,
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`gradient-border-component ${animClass} ${className}`}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export { BorderRotate };
