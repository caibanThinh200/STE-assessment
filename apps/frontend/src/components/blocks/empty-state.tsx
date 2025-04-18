"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "../icons";

interface EmptyStateProps {
  onGetLocation: () => void;
  loading: boolean;
}

export default function EmptyState({
  onGetLocation,
  loading,
}: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-gray-400"
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            <path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold">No Weather Data</h3>
        <p className="mb-4 text-sm text-gray-500">
          Search for a location or use your current location to see weather
          information.
        </p>
        <Button onClick={onGetLocation} disabled={loading}>
          {loading ? (
            <>
              <Icon variant="spin" className="mr-2" />
              Getting Location...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Use My Location
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
