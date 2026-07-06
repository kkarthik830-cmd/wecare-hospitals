import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function LucideIcon({ name, className = '', size = 24, strokeWidth = 2 }: LucideIconProps) {
  // Safe lookup with fallback
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Return a default fallback icon if not found
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} size={size} strokeWidth={strokeWidth} />;
  }
  
  return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />;
}
