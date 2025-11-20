export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Square */}
      <rect width="100" height="100" rx="16" fill="white" />
      
      {/* House Icon */}
      <path
        d="M50 20L25 42V75H40V55H60V75H75V42L50 20Z"
        fill="url(#logo-gradient)"
        stroke="url(#logo-gradient)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="logo-gradient" x1="25" y1="20" x2="75" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}
