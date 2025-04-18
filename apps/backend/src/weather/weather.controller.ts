import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('location')
  getWeatherByLocation(
    @Query('q') location: string,
    @Query('date') date?: string,
  ) {
    return this.weatherService.getWeatherByLocation(location, date);
  }

  @Get('coords')
  getWeatherByCoords(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('date') date?: string,
  ) {
    return this.weatherService.getWeatherByCoords(lat, lon, date);
  }

  @Get('suggestions')
  getLocationSuggestions(@Query('q') query: string) {
    return this.weatherService.getLocationSuggestions(query);
  }
}
