"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, LoadingSpinner } from "./Icons";

interface SelectedSources {
  twitter: boolean;
  reddit: boolean;
  mastodon: boolean;
}

interface SearchBarProps {
  selectedSources?: SelectedSources;
}

export default function SearchBar({ selectedSources }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("keyword");
  const [isLoading, setIsLoading] = useState(false);

  // Monitor changes to searchType and redirect if it's set to "website"
  useEffect(() => {
    if (searchType === "website") {
      router.push("/dashboard-news");
    }
  }, [searchType, router]);

  // Validate the search query based on the search type.
  let isQueryValid = false;
  const trimmedQuery = searchQuery.trim();

  if (trimmedQuery) {
    if (searchType === "keyword") {
      isQueryValid = true;
    } else if (searchType === "hashtag") {
      // Hashtag search: valid only if it starts with a "#"
      isQueryValid = trimmedQuery.startsWith("#");
    }
  }

  // The Analyze button is disabled if the query isn't valid or if it's loading.
  const isDisabled = isLoading || !isQueryValid;

  const handleSearch = async () => {
    if (!isQueryValid) return;

    // Determine which sources are selected.
    let sources: string[] = [];
    if (
      selectedSources &&
      Object.values(selectedSources).some((selected) => selected)
    ) {
      sources = Object.entries(selectedSources)
        .filter(([_, isSelected]) => isSelected)
        .map(([source]) => source);
    } else {
      // If no specific source is selected, use all three platforms.
      sources = ["twitter", "reddit", "mastodon"];
    }

    setIsLoading(true);

    // Build the query string.
    const queryString = new URLSearchParams({
      q: trimmedQuery,
      searchType,
      sources: sources.join(","),
    }).toString();

    try {
      if (selectedSources?.twitter) {
        // For searches with Twitter selected,
        // redirect to /dashboard-twitter with the query string.
        router.push(`/dashboard-twitter?${queryString}`);
      } else {
        // Otherwise, redirect to dashboard-reddit (for example).
        router.push(`/dashboard-reddit?${queryString}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Full-page loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl font-semibold">
            Loading Dashboard...
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mb-16">
        <div className="flex">
          {/* Dropdown Selector */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            disabled={isLoading}
            className="w-32 px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-l-xl focus:outline-none disabled:opacity-50"
          >
            <option value="keyword">Keyword</option>
            <option value="hashtag">Hashtag</option>
            <option value="website">Website</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Enter ${searchType} to analyze...`}
              disabled={isLoading}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleSearch}
            disabled={isDisabled}
            className={`ml-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
            rounded-lg transition-all duration-300 flex items-center gap-2 ${
              !isDisabled
                ? "hover:from-blue-700 hover:to-purple-700"
                : "disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isLoading ? <LoadingSpinner /> : "Analyze"}
          </button>
        </div>
      </div>
    </>
  );
}
