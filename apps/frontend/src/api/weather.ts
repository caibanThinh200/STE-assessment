import api from "@/lib/api";
import { LocationSuggestion, WeatherData } from "@/types";
import axios from "axios";

export async function fetchWeatherData(
  location: string,
  date?: string
): Promise<WeatherData> {
  try {
    const response = await api.get("/weather/location", {
      params: { q: location, date },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch weather data"
      );
    }
    throw error;
  }
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  date?: string
): Promise<WeatherData> {
  try {
    const response = await api.get<WeatherData>("/weather/coords", {
      params: { lat, lon, date },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch weather data"
      );
    }
    throw error;
  }
}

export async function fetchLocationSuggestions(
  query: string
): Promise<LocationSuggestion[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await api.get("/weather/suggestions", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
}
