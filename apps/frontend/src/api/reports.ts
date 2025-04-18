import api from "@/lib/api";
import { CreateReport, WeatherReport } from "@/types";

// Weather Reports API functions
export async function fetchAllReports(filter?: {
  location: string;
}): Promise<WeatherReport[]> {
  try {
    const response = await api.get("/reports", { params: filter });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function fetchReportById(id: string): Promise<WeatherReport> {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    throw new Error("Failed to fetch report");
  }
}

export async function fetchReportsByIds(
  ids: string[]
): Promise<WeatherReport[]> {
  try {
    const response = await api.get(`/reports/compare/${ids.join(",")}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reports ${ids}:`, error);
    throw new Error("Failed to fetch reports for comparison");
  }
}

export async function createReport(
  report: CreateReport
): Promise<WeatherReport> {
  try {
    const response = await api.post("/reports", report);
    return response.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error("Failed to create report");
  }
}

export async function deleteReport(id: string): Promise<void> {
  try {
    await api.delete(`/reports/${id}`);
  } catch (error) {
    console.error(`Error deleting report ${id}:`, error);
    throw new Error("Failed to delete report");
  }
}
