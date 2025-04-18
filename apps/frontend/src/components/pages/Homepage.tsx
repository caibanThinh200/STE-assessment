import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import SearchBar from "../blocks/search-bar";
import CurrentWeather from "../blocks/current-weather";
import EmptyState from "../blocks/empty-state";
import { CreateReport, WeatherData } from "@/types";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Icon from "../icons";
import { fetchWeatherByCoords, fetchWeatherData } from "@/api/weather";
import { createReport } from "@/api/reports";

function HomePage() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Reset report generated state when weather data changes
  useEffect(() => {
    setReportGenerated(false);
  }, [weatherData]);

  const handleSearch = async (location: string) => {
    if (!location.trim()) return handleGetCurrentLocation();

    setLoading(true);
    try {
      const data = await fetchWeatherData(location).catch(() => {
        return null;
      });
      setWeatherData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const saveWeatherReport = async (data: WeatherData) => {
    if (!weatherData) {
      toast("Please search for a location first to generate a report.", {
        type: "error",
      });
      return;
    }

    const reportData: CreateReport = {
      location: data.location,
      timestamp: Date.now(),
      temperature: data.current.temp,
      pressure: data.current.pressure || 0,
      humidity: data.current.humidity,
      cloudCover: data.current.cloudCover || 0,
      description: data.current.description,
      icon: data.current.weatherIcon,
    };
    setReportGenerated(true);

    toast("Report Generated", { type: "success", position: "top-center" });
    createReport(reportData);
  };

  const handleGetCurrentLocation = () => {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log(position.coords);
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoords(latitude, longitude);
          setWeatherData(data);

          // Add to search history if not already present
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch weather data for your location.";

          toast(errorMessage, { type: "error" });
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        let message = "Failed to get your location.";
        console.log(error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location access was denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "The request to get your location timed out.";
            break;
        }

        toast(message, {
          type: "error",
        });
        setGeoLoading(false);
      }
    );
  };

  // Try to get user's location on first render
  useEffect(() => {
    handleGetCurrentLocation();
    // If geolocation fails or is denied, we'll fall back to the empty state
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Weather Report Generator</h1>
          <Button variant="outline" onClick={() => navigate("/history")}>
            <Icon variant="clock" className="mr-2" />
            View Reports History
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Generate Weather Report</CardTitle>
            <Button
              onClick={() => saveWeatherReport(weatherData as WeatherData)}
              disabled={!weatherData || loading}
              className="bg-black"
            >
              <Icon variant="download" />
              Generate Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  {/* <Label htmlFor="location">Location</Label> */}
                  <div className="mt-1">
                    <SearchBar
                      onSearch={handleSearch}
                      loading={loading}
                      onGetLocation={handleGetCurrentLocation}
                      geoLoading={geoLoading}
                    />
                  </div>
                </div>
                {/* <div>
                  <Label htmlFor="date">Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for current date
                  </p>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {weatherData ? (
          <div
            className={`transition-all duration-300 ${
              reportGenerated
                ? "opacity-100 scale-100"
                : "opacity-95 scale-[0.99]"
            }`}
          >
            <Card
              className={`mb-6 overflow-hidden ${
                reportGenerated ? "border-green-500 shadow-lg" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Weather Report: {weatherData.location}</span>
                  {reportGenerated && (
                    <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center">
                      <Icon variant="check" className="mr-1" />
                      Report Generated
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CurrentWeather
                  data={weatherData.current}
                  location={weatherData.location}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            onGetLocation={handleGetCurrentLocation}
            loading={geoLoading}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
