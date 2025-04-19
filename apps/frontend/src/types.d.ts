export interface CurrentWeatherData {
  date: Date;
  temp: number;
  description: string;
  weatherIcon: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  pressure?: number;
  cloudCover?: number;
}

export interface WeatherData {
  location: string;
  current: CurrentWeatherData;
}

export interface ForecastData {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  dt_txt: string;
}

export interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
}

export type CreateReport = Omit<WeatherReport, "_id">;

export interface WeatherReport {
  _id: string;
  location: string;
  timestamp: number;
  temperature: number;
  pressure: number;
  humidity: number;
  cloudCover: number;
  description: string;
  icon: string;
}

export interface User {
  _id: string
  email: string
  name: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}
