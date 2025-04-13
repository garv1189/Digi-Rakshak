"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import {
  TwitterIcon,
  RedditIcon,
  MastodonIcon,
} from "./components/Icons";

export default function HomePage() {
  const [selectedSources, setSelectedSources] = useState({
    twitter: false,
    reddit: false,
    mastodon: false,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Analyze Social Media{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Trends
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover insights across multiple platforms with our advanced
              analytics tools.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar selectedSources={selectedSources} />

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Twitter Card */}
            <div
              onClick={() =>
                setSelectedSources((prev) => ({
                  ...prev,
                  twitter: !prev.twitter,
                }))
              }
              className={`cursor-pointer group bg-gray-800/50 backdrop-blur-sm border ${
                selectedSources.twitter
                  ? "border-blue-500 ring-2 ring-blue-500/50"
                  : "border-gray-700"
              } rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-400">
                  <TwitterIcon />
                </div>
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  Real-time
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Twitter Analytics
              </h3>
              <p className="text-gray-400">
                Track engagement, analyze trends, and monitor social sentiment
                in real-time.
              </p>
            </div>

            {/* Reddit Card */}
            <div
              onClick={() =>
                setSelectedSources((prev) => ({
                  ...prev,
                  reddit: !prev.reddit,
                }))
              }
              className={`cursor-pointer group bg-gray-800/50 backdrop-blur-sm border ${
                selectedSources.reddit
                  ? "border-green-500 ring-2 ring-green-500/50"
                  : "border-gray-700"
              } rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-orange-500">
                  <RedditIcon />
                </div>
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  Reddit Data
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Reddit Insights
              </h3>
              <p className="text-gray-400">
                Comprehensive analysis of Reddit trends, discussions, and
                engagement.
              </p>
            </div>

            {/* Mastodon Card */}
            <div
              onClick={() =>
                setSelectedSources((prev) => ({
                  ...prev,
                  mastodon: !prev.mastodon,
                }))
              }
              className={`cursor-pointer group bg-gray-800/50 backdrop-blur-sm border ${
                selectedSources.mastodon
                  ? "border-purple-500 ring-2 ring-purple-500/50"
                  : "border-gray-700"
              } rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-purple-400">
                  <MastodonIcon />
                </div>
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  Federated
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Mastodon Metrics
              </h3>
              <p className="text-gray-400">
                Deep insights into federated social networks and community
                engagement.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center">
            <div className="inline-flex space-x-4 bg-gray-800/30 rounded-full p-1 mb-8">
              <span className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full">
                Real-time Analysis
              </span>
              <span className="px-4 py-2 text-sm text-gray-400">
                Custom Reports
              </span>
              <span className="px-4 py-2 text-sm text-gray-400">
                API Access
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
