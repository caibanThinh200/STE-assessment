import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { WeatherReport } from "@/types";
import WeatherIcon from "@/components/blocks/weather-icon";
import { debounce, formatDate } from "@/lib/utils";
import Icon from "../icons";
import { deleteReport, fetchAllReports } from "@/api/reports";
import { toast } from "react-toastify";

export default function WeatherReportsPage() {
  const navigate = useNavigate();
  const [weatherReports, setWeatherReports] = useState<WeatherReport[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof WeatherReport;
    direction: "ascending" | "descending";
  } | null>(null);

  const debouncedFetchSuggestions = debounce(async (query: string) => {
    try {
      const reports = await fetchAllReports({ location: query });
      setWeatherReports(reports);
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  }, 300);

  useEffect(() => {
    debouncedFetchSuggestions(searchTerm);
  }, [searchTerm]);

  const deleteWeatherReport = (id: string) => {
    deleteReport(id).then(() => {
      debouncedFetchSuggestions(searchTerm);
      toast("Report deleted", { type: "warning" });
    });
  };

  // Handle sorting
  const handleSort = (key: keyof WeatherReport) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    const sortedReports = [...weatherReports].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setWeatherReports(sortedReports);
  };

  const handleReportSelection = (id: string) => {
    setSelectedReports((prev) => {
      // If already selected, remove it
      if (prev.includes(id)) {
        return prev.filter((reportId) => reportId !== id);
      }

      // If we already have 2 selected, replace the oldest one
      if (prev.length >= 2) {
        return [prev[1], id];
      }

      // Otherwise add it
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selectedReports.length !== 2) return;

    // Navigate to comparison page with the selected report IDs
    navigate(`/compare/${selectedReports[0]}/${selectedReports[1]}`);
  };

  const getSortIcon = (key: keyof WeatherReport) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 ml-1 text-gray-400"
        >
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      );
    }

    return sortConfig.direction === "ascending" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 ml-1"
      >
        <path d="m7 15 5 5 5-5" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 ml-1"
      >
        <path d="m7 9 5-5 5 5" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Weather Reports History</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Icon variant="arrow" className="w-4 h-4 mr-2 -rotate-90" />
            Back to Weather
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-auto flex-1">
                <Icon
                  variant="loop"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Search by location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Clear search"
                  >
                    <Icon variant="close" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  onClick={handleCompare}
                  disabled={selectedReports.length !== 2}
                  className="whitespace-nowrap"
                >
                  Compare Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center">
                        Location {getSortIcon("location")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("timestamp")}
                    >
                      <div className="flex items-center">
                        Timestamp {getSortIcon("timestamp")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("temperature")}
                    >
                      <div className="flex items-center">
                        Temperature (°C) {getSortIcon("temperature")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("pressure")}
                    >
                      <div className="flex items-center">
                        Pressure (hPa) {getSortIcon("pressure")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("humidity")}
                    >
                      <div className="flex items-center">
                        Humidity (%) {getSortIcon("humidity")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("cloudCover")}
                    >
                      <div className="flex items-center">
                        Cloud Cover (%) {getSortIcon("cloudCover")}
                      </div>
                    </TableHead>
                    <TableHead>Weather</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weatherReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No weather reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    weatherReports.map((report) => (
                      <TableRow
                        key={report._id}
                        className={
                          selectedReports.includes(report._id)
                            ? "bg-blue-50"
                            : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedReports.includes(report._id)}
                            onCheckedChange={() =>
                              handleReportSelection(report._id)
                            }
                            aria-label={`Select report for ${report.location}`}
                          />
                        </TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>
                          {formatDate(new Date(report.timestamp))}
                        </TableCell>
                        <TableCell>{report.temperature}°C</TableCell>
                        <TableCell>{report.pressure}</TableCell>
                        <TableCell>{report.humidity}%</TableCell>
                        <TableCell>{report.cloudCover}%</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <WeatherIcon code={report.icon} size="sm" />
                            <span className="ml-2 text-sm">
                              {report.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => deleteWeatherReport(report._id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4 mr-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
