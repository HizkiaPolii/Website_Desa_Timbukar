import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  hover = true,
  className = "",
}: CardProps) {
  return (
    <div
      className={`card-base card-padding ${
        hover ? "hover:shadow-lg" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StatsCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  color?: "blue" | "green" | "red" | "purple" | "pink" | "yellow";
}

const colorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  yellow: "text-yellow-600",
};

export function StatsCard({
  icon,
  label,
  value,
  color = "blue",
}: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`${colorClasses[color]} opacity-80`}>{icon}</div>
        )}
      </div>
    </Card>
  );
}
