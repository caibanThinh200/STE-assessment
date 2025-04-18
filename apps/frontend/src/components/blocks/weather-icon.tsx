import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function WeatherIcon({
  code,
  size = "md",
  className,
}: WeatherIconProps) {
  // Base URL for OpenWeather icons
  const iconBaseUrl = "https://openweathermap.org/img/wn";

  // Size mapping for both the container and the image
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-36 h-36",
  };

  // Determine if we should use the 2x version for better quality
  const iconSizes = {
    sm: "",
    md: "@2x",
    lg: "@4x",
  };

  // Construct the full icon URL
  const iconUrl = `${iconBaseUrl}/${code}${iconSizes[size]}.png`;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <img
        src={iconUrl || "/placeholder.svg"}
        alt={`Weather icon: ${code}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
