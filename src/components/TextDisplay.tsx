interface TextDisplayProps {
    value: string | number;
    className?: string;
  }

  export const TextDisplay: React.FC<TextDisplayProps> = ({ value, className = "" }) => (
    <div className={`p-1 min-h-[2rem] ${className}`}>{value || ""}</div>
  );
  