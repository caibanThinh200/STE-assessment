import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WeatherReport } from "@/types";
import { formatDate } from "@/lib/utils";
import WeatherIcon from "../blocks/weather-icon";
import Icon from "../icons";
import { fetchReportById } from "@/api/reports";

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { reportId1, reportId2 } = useParams<{
    reportId1: string;
    reportId2: string;
  }>();
  const [report1, setReport1] = useState<WeatherReport | null>(null);
  const [report2, setReport2] = useState<WeatherReport | null>(null);

  const handleGetReport = async () => {
    const foundReport1 = await fetchReportById(reportId1 as string);
    const foundReport2 = await fetchReportById(reportId1 as string);

    if (foundReport1) setReport1(foundReport1);
    if (foundReport2) setReport2(foundReport2);

    // If either report is not found, navigate back to reports page
    if (!foundReport1 || !foundReport2) {
      // navigate("/history");
    }
  };

  useEffect(() => {
    handleGetReport();
  }, [reportId1, reportId2, navigate]);

  if (!report1 || !report2) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Loading comparison data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate differences
  const tempDiff = Math.abs(report1.temperature - report2.temperature).toFixed(
    1
  );
  const pressureDiff = Math.abs(report1.pressure - report2.pressure).toFixed(0);
  const humidityDiff = Math.abs(report1.humidity - report2.humidity).toFixed(0);
  const cloudCoverDiff = Math.abs(
    report1.cloudCover - report2.cloudCover
  ).toFixed(0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Weather Report Comparison</h1>
          <Button variant="outline" onClick={() => navigate("/history")}>
            <Icon variant="arrow" className="w-4 h-4 mr-2 -rotate-90" />
            Back to Reports
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comparison Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 mb-4">
              <div>
                <strong>Report 1:</strong> {report1.location}
              </div>
              <div>
                <strong>Report 2:</strong> {report2.location}
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="w-1/4">Parameter</TableHead>
                    <TableHead className="w-1/4">Report 1</TableHead>
                    <TableHead className="w-1/4">Report 2</TableHead>
                    <TableHead className="w-1/4">Deviation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Timestamp</TableCell>
                    <TableCell>
                      {formatDate(new Date(report1.timestamp))}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(report2.timestamp))}
                    </TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Temperature (°C)
                    </TableCell>
                    <TableCell>{report1.temperature}</TableCell>
                    <TableCell>{report2.temperature}</TableCell>
                    <TableCell
                      className={
                        Number(tempDiff) > 0 ? "text-red-500 font-medium" : ""
                      }
                    >
                      {tempDiff}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pressure (hPa)
                    </TableCell>
                    <TableCell>{report1.pressure}</TableCell>
                    <TableCell>{report2.pressure}</TableCell>
                    <TableCell
                      className={
                        Number(pressureDiff) > 0
                          ? "text-amber-500 font-medium"
                          : ""
                      }
                    >
                      {pressureDiff}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Humidity (%)</TableCell>
                    <TableCell>{report1.humidity}</TableCell>
                    <TableCell>{report2.humidity}</TableCell>
                    <TableCell
                      className={
                        Number(humidityDiff) > 0
                          ? "text-blue-500 font-medium"
                          : ""
                      }
                    >
                      {humidityDiff}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Cloud Cover (%)
                    </TableCell>
                    <TableCell>{report1.cloudCover}</TableCell>
                    <TableCell>{report2.cloudCover}</TableCell>
                    <TableCell
                      className={
                        Number(cloudCoverDiff) > 0
                          ? "text-gray-500 font-medium"
                          : ""
                      }
                    >
                      {cloudCoverDiff}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Weather</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <WeatherIcon
                          code={report1.icon}
                          className="size-8 mr-2"
                        />
                        {report1.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <WeatherIcon
                          code={report2.icon}
                          className="size-8 mr-2"
                        />
                        {report2.description}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
