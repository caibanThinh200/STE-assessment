import { formatDate } from "@/lib/utils";
import type { CurrentWeatherData } from "@/types";
import WeatherIcon from "./weather-icon";
import Icon from "../icons";

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  location: string;
}

export default function CurrentWeather({
  data,
  location,
}: CurrentWeatherProps) {
  console.log(data)
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Icon className="mr-2 w-5 h-5" variant="pin" />
          <span className="text-lg">{location}</span>
        </div>
      </div>

      <div className="overflow-hidden">
        <div>
          <div className="text-lg text-gray-500 mb-4">
            {formatDate(new Date(data.date))}
          </div>

          <div className="flex items-center justify-center gap-20">
            <div className="flex flex-1 justify-end">
              <WeatherIcon code={data.weatherIcon} size="lg" />
            </div>
            <div className="flex-1 space-y-3 flex justify-start">
              <div className="flex flex-col gap-5">
                <div className="text-5xl font-bold">{data.temp}°C</div>
                <div className="text-gray-600 capitalize text-xl font-semibold">
                  {data.description}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 md:gap-4 mt-6 text-center">
            <div>
              <div className="text-sm text-gray-500">Humidity</div>
              <div className="font-bold lg:text-xl text-base">
                {data.humidity} %
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Winds</div>
              <div className="font-bold lg:text-xl text-base flex items-center justify-center">
                <Icon
                  variant="arrow"
                  className="ml-2"
                  style={{ transform: `rotate(${data.windDeg}deg)` }}
                />
                <span>{data.windSpeed} m/s</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Visibility</div>
              <div className="font-bold lg:text-xl text-base">
                {data.visibility} km
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pressure</p>
              <p className="font-bold lg:text-xl text-base">
                {data.pressure || "N/A"} hPa
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cloud Cover</p>
              <p className="font-bold lg:text-xl text-base">
                {!isNaN(data.cloudCover || 0) ? data?.cloudCover : "N/A"}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Visibility</p>
              <p className="font-bold lg:text-xl text-base">
                {data.visibility} km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
