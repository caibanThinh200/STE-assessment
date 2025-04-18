"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchLocationSuggestions } from "@/api/weather";
import { debounce } from "@/lib/utils";
import type { LocationSuggestion } from "@/types";
import Icon from "../icons";

interface SearchBarProps {
  onSearch: (location: string) => void;
  loading: boolean;
  onGetLocation?: () => void;
  geoLoading?: boolean;
}

export default function SearchBar({
  onSearch,
  loading,
  onGetLocation,
  geoLoading = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a debounced function for fetching suggestions
  const debouncedFetchSuggestions = useRef(
    debounce(async (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        setFetchingSuggestions(false);
        return;
      }

      try {
        setFetchingSuggestions(true);
        const results = await fetchLocationSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setFetchingSuggestions(false);
      }
    }, 300)
  ).current;

  // Fetch suggestions when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setFetchingSuggestions(true);
      debouncedFetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, debouncedFetchSuggestions]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setSearchTerm(suggestion.displayName);
    onSearch(suggestion.displayName);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 gap-y-5 items-center flex-col lg:flex-row relative"
    >
      <div className="relative flex-1 w-full">
        <Icon
          variant="pin"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter location (e.g., Singapore, SG)"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 bg-white w-full"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <Icon variant="close" />
          </button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && searchTerm.length >= 2 && (
          <div
            ref={suggestionRef}
            className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {fetchingSuggestions ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Loading suggestions...
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="py-1">
                {suggestions.map((suggestion) => (
                  <li
                    key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}`}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Icon
                      variant="pin"
                      className="w-4 h-4 mr-2 text-gray-400"
                    />
                    {suggestion.displayName}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 text-sm text-gray-500 text-center">
                No suggestions found
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center w-full lg:w-auto">
        <Button
          type="submit"
          className="bg-primary-blue hover:bg-blue-700 flex-1"
          disabled={loading}
        >
          {loading ? (
            <Icon variant="spin" className="-ml-1 mr-2 text-white" />
          ) : (
            <Icon variant="loop" />
          )}
          <span>Search</span>
        </Button>

        {onGetLocation && (
          <Button
            type="button"
            variant="outline"
            className="bg-white"
            onClick={onGetLocation}
            disabled={geoLoading}
          >
            {geoLoading ? (
              <Icon variant="spin" className="-ml-1 mr-2 text-white" />
            ) : (
              <Icon variant="pin" />
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
