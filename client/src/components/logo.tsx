interface LogoProps {
  className?: string;
  size?: number;
}

export function VaultSimLogo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vault/Safe Icon */}
      <rect
        x="20"
        y="30"
        width="60"
        height="50"
        rx="5"
        fill="currentColor"
        className="text-blue-600"
      />
      
      {/* Vault Door */}
      <rect
        x="25"
        y="35"
        width="50"
        height="40"
        rx="3"
        fill="currentColor"
        className="text-blue-500"
      />
      
      {/* Combination Lock */}
      <circle
        cx="50"
        cy="55"
        r="12"
        fill="currentColor"
        className="text-blue-700"
      />
      
      {/* Lock Center */}
      <circle
        cx="50"
        cy="55"
        r="8"
        fill="currentColor"
        className="text-blue-300"
      />
      
      {/* Lock Handle */}
      <rect
        x="46"
        y="51"
        width="8"
        height="2"
        fill="currentColor"
        className="text-blue-800"
      />
      
      {/* Digital Display Lines */}
      <rect x="30" y="42" width="15" height="2" rx="1" fill="currentColor" className="text-green-400" />
      <rect x="30" y="46" width="12" height="2" rx="1" fill="currentColor" className="text-green-400" />
      
      {/* ATM Card Slot */}
      <rect x="65" y="42" width="10" height="3" rx="1" fill="currentColor" className="text-gray-600" />
    </svg>
  );
}

export function CustomImageLogo({ src, alt = "VaultSim Logo", className = "", size = 40 }: { src: string; alt?: string; className?: string; size?: number }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}