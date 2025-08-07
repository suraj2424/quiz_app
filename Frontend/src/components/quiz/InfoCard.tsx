import { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  theme?: 'success' | 'warning' | 'danger' | 'primary' | 'secondary';
}

export default function InfoCard({ icon, label, value, theme = 'primary' }: InfoCardProps) {
  const getThemeStyles = (theme: string) => {
    const baseStyles = "rounded-xl p-4 transition-all duration-200 hover:shadow-lg";
    switch (theme) {
      case "success":
        return `${baseStyles} bg-green-50 text-green-600 border border-green-200`;
      case "warning":
        return `${baseStyles} bg-yellow-50 text-yellow-600 border border-yellow-200`;
      case "danger":
        return `${baseStyles} bg-red-50 text-red-600 border border-red-200`;
      case "primary":
        return `${baseStyles} bg-blue-50 text-blue-600 border border-blue-200`;
      case "secondary":
        return `${baseStyles} bg-purple-50 text-purple-600 border border-purple-200`;
      default:
        return baseStyles;
    }
  };

  return (
    <div className={getThemeStyles(theme)}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm opacity-70">{label}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}