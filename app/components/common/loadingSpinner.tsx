// app/components/ui/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  borderWidth?: number;
  className?: string;
}

export default function LoadingSpinner({
  size = 20,
  color = 'border-white',
  borderWidth = 2,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`rounded-full animate-spin`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${borderWidth}px`,
          borderColor: `${color.replace('border-', '')} ${color.replace('border-', '')} var(--neutral-40) var(--neutral-40)`,
        }}
      />
    </div>
  );
}