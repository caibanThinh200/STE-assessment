import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';
import { type Observable, throwError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly geoUrl = 'https://api.openweathermap.org/geo/1.0';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
  }

  getWeatherByLocation(location: string, date?: string): Observable<any> {
    // If a date is provided and it's in the past, we would handle historical data
    // Note: Historical data requires a paid OpenWeather API plan

    // For now, we'll just fetch current weather
    return this.httpService
      .get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
        },
      })
      .pipe(
        map(async (weatherResponse) => {
          const weatherData = weatherResponse.data;

          // Fetch forecast data
          const forecastResponse = await firstValueFrom(
            this.httpService.get(`${this.baseUrl}/forecast`, {
              params: {
                q: location,
                appid: this.apiKey,
                units: 'metric',
              },
            }),
          );

          const forecastData = forecastResponse.data;

          // Format the response
          return this.formatWeatherData(weatherData, forecastData);
        }),
        catchError((error) => {
          if (error.response) {
            throw new HttpException(
              error.response.data.message || 'Failed to fetch weather data',
              error.response.status || HttpStatus.BAD_REQUEST,
            );
          }
          return throwError(() => error);
        }),
      );
  }

  getWeatherByCoords(lat: number, lon: number, date?: string): Observable<any> {
    // For now, we'll just fetch current weather
    return this.httpService
      .get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
        },
      })
      .pipe(
        map(async (weatherResponse) => {
          const weatherData = weatherResponse.data;

          // Fetch forecast data
          const forecastResponse = await this.httpService
            .get(`${this.baseUrl}/forecast`, {
              params: {
                lat,
                lon,
                appid: this.apiKey,
                units: 'metric',
              },
            })
            .toPromise();

          const forecastData = forecastResponse.data;

          // Format the response
          return this.formatWeatherData(weatherData, forecastData);
        }),
        catchError((error) => {
          if (error.response) {
            throw new HttpException(
              error.response.data.message || 'Failed to fetch weather data',
              error.response.status || HttpStatus.BAD_REQUEST,
            );
          }
          return throwError(() => error);
        }),
      );
  }

  getLocationSuggestions(query: string): Observable<any> {
    if (!query || query.length < 2) {
      return throwError(
        () => new HttpException('Query too short', HttpStatus.BAD_REQUEST),
      );
    }

    return this.httpService
      .get(`${this.geoUrl}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey,
        },
      })
      .pipe(
        map((response) => {
          return response.data.map((item) => ({
            name: item.name,
            country: item.country,
            state: item.state,
            lat: item.lat,
            lon: item.lon,
            displayName: item.state
              ? `${item.name}, ${item.state}, ${item.country}`
              : `${item.name}, ${item.country}`,
          }));
        }),
        catchError((error) => {
          if (error.response) {
            throw new HttpException(
              error.response.data.message ||
                'Failed to fetch location suggestions',
              error.response.status || HttpStatus.BAD_REQUEST,
            );
          }
          return throwError(() => error);
        }),
      );
  }

  private formatWeatherData(weatherData, forecastData) {
    // Format current weather data
    const current = {
      date: new Date(weatherData.dt * 1000),
      temp: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      weatherIcon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      windDeg: weatherData.wind.deg,
      visibility: Math.round(weatherData.visibility / 1000),
      pressure: weatherData.main.pressure,
      cloudCover: weatherData.clouds?.all || 0,
    };

    // Return formatted data
    return {
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      current,
      forecast: forecastData.list,
    };
  }
}
