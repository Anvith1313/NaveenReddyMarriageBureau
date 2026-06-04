import s from './verified.module.css'

interface Props {
  size?: number
  className?: string
}

export default function VerifiedBadge({ size = 18, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${s.badge} ${className}`}
      aria-label="Verified profile"
      role="img"
    >
      {/* Scalloped badge shape matching the uploaded blue verified icon */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 0
           L23.1 3.2 L27.6 2.3 L29.3 6.5 L33.8 7
           L33.8 11.5 L37.8 13.9 L36.2 18.3
           L39 22 L36.2 25.7 L37.8 30.1
           L33.8 32.5 L33.8 37 L29.3 37.5
           L27.6 41.7 L23.1 40.8 L20 44
           L16.9 40.8 L12.4 41.7 L10.7 37.5
           L6.2 37 L6.2 32.5 L2.2 30.1
           L3.8 25.7 L1 22 L3.8 18.3
           L2.2 13.9 L6.2 11.5 L6.2 7
           L10.7 6.5 L12.4 2.3 L16.9 3.2 Z"
        fill="#1D9BF0"
      />
      {/* White checkmark */}
      <path
        d="M13 22.5 L18.5 28 L28 16"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
