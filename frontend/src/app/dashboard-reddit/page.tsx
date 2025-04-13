"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  DoughnutController,
  ArcElement,
  TimeScale,
  RadialLinearScale,
  ScatterController,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Pie, Line, Scatter, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  DoughnutController,
  ArcElement,
  TimeScale,
  RadialLinearScale,
  ScatterController,
  Tooltip,
  Legend,
  Title
);

// Extended interface with an optional posts field
interface DashboardData {
  is_reliable: boolean;
  message: string;
  domain: string;
  whois_info: Record<string, any>;
  media_details: Record<string, any>;
  social_media_stats: {
    reddit_mentions: number | string;
  };
  // Assuming the backend returns posts in Reddit's format:
  posts?: {
    data: {
      children: { data: any }[];
    };
  };
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchType = searchParams.get("searchType") || "";
  const sources = searchParams.get("sources") || "";

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  // Chart theme colors
  const colors = {
    background: "rgba(30, 41, 59, 0.8)", // Tailwind bg-gray-800 with transparency
    text: "#ffffff",
    grid: "rgba(255, 255, 255, 0.1)",
    reliable: "rgba(16, 185, 129, 0.7)", // Green with transparency
    unreliable: "rgba(239, 68, 68, 0.7)", // Red with transparency
    primary: "rgba(59, 130, 246, 0.7)", // Blue with transparency
    secondary: "rgba(139, 92, 246, 0.7)", // Purple with transparency
    accent1: "rgba(245, 158, 11, 0.7)", // Amber with transparency
    accent2: "rgba(236, 72, 153, 0.7)", // Pink with transparency
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: colors.text },
      },
      title: {
        display: true,
        color: colors.text,
      },
      tooltip: {
        backgroundColor: colors.background,
        titleColor: colors.text,
        bodyColor: colors.text,
      },
    },
    scales: {
      x: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
      y: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
    },
  };

  useEffect(() => {
    // Only call the backend if the search is based on a website URL and "reddit" is selected.
    if (searchType === "website" && sources.includes("reddit") && query) {
      setLoading(true);
      fetch(`http://localhost:8000/check_news?url=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error fetching data from the backend");
          }
          return res.json();
        })
        .then((data: DashboardData) => {
          setDashboardData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load data: " + err.message);
          setLoading(false);
        });
    }
  }, [query, searchType, sources]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">{error}</div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto py-8 text-white">
        No dashboard data available. Please initiate a search.
      </div>
    );
  }

  // Ensure that the reddit_mentions value is a number.
  const redditMentions = Number(dashboardData.social_media_stats.reddit_mentions);

  // Process posts data if available
  const posts = dashboardData.posts
    ? dashboardData.posts.data.children.map((item) => item.data)
    : [];

  // 1. Posts per Subreddit (PieChart)
  const subredditCounts = posts.reduce((acc, post) => {
    const sub = post.subreddit || "Unknown";
    acc[sub] = (acc[sub] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const postsPerSubredditData = {
    labels: Object.keys(subredditCounts),
    datasets: [
      {
        data: Object.values(subredditCounts),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.reliable,
          colors.accent1,
          colors.accent2,
        ],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 2. Upvote Ratio per Post (BarChart)
  const upvoteData = {
    labels: posts.slice(0, 10).map((post) => post.title.substring(0, 10) + "..."),
    datasets: [
      {
        label: "Upvote Ratio",
        data: posts.slice(0, 10).map((post) => post.upvote_ratio || 0),
        backgroundColor: colors.primary,
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 3. Score Distribution (BarChart)
  const scoreData = {
    labels: posts.slice(0, 10).map((post) => post.title.substring(0, 10) + "..."),
    datasets: [
      {
        label: "Score",
        data: posts.slice(0, 10).map((post) => post.score || 0),
        backgroundColor: colors.accent1,
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 4. Domain Distribution (BarChart)
  const domainCounts = posts.reduce((acc, post) => {
    const domain = post.domain || "Unknown";
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const domainData = {
    labels: Object.keys(domainCounts),
    datasets: [
      {
        label: "Posts Count",
        data: Object.values(domainCounts),
        backgroundColor: colors.secondary,
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 5. Media Presence (PieChart)
  const withMedia = posts.filter((post) => post.media).length;
  const withoutMedia = posts.length - withMedia;
  const mediaPresenceData = {
    labels: ["With Media", "Without Media"],
    datasets: [
      {
        data: [withMedia, withoutMedia],
        backgroundColor: [colors.reliable, colors.unreliable],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 6. Title Length per Post (ScatterChart)
  const titleLengthData = {
    datasets: [
      {
        label: "Title Length",
        data: posts.map((post, index) => ({
          x: index + 1,
          y: post.title.length,
        })),
        backgroundColor: colors.accent2,
        borderColor: colors.text,
      },
    ],
  };

  // 7. Number of Comments per Post (BarChart)
  const commentsData = {
    labels: posts.slice(0, 10).map((_, index) => `Post ${index + 1}`),
    datasets: [
      {
        label: "Comments",
        data: posts.slice(0, 10).map((post) => post.num_comments || 0),
        backgroundColor: colors.primary,
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 8. Upvotes per Post (BarChart)
  const upsData = {
    labels: posts.slice(0, 10).map((_, index) => `Post ${index + 1}`),
    datasets: [
      {
        label: "Upvotes",
        data: posts.slice(0, 10).map((post) => post.ups || 0),
        backgroundColor: colors.reliable,
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 9. Downvotes per Post (BarChart)
  const downsData = {
    labels: posts.slice(0, 10).map((_, index) => `Post ${index + 1}`),
    datasets: [
      {
        label: "Downvotes",
        data: posts.slice(0, 10).map((post) => post.downs || 0),
        backgroundColor: colors.unreliable,
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 10. Posts by Hour of Day (LineChart)
  const timeCounts: Record<string, number> = {};
  posts.forEach((post) => {
    // Assuming post.created is in seconds (epoch time)
    const date = new Date(post.created * 1000);
    const hour = date.getHours();
    timeCounts[hour] = (timeCounts[hour] || 0) + 1;
  });
  const timeLabels = Array.from({ length: 24 }, (_, i) => i.toString());
  const timeDataCounts = timeLabels.map((hour) => timeCounts[hour] || 0);
  const timeData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Posts",
        data: timeDataCounts,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: colors.primary,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // 11. Upvote Ratio vs Score (ScatterChart)
  const ratioScoreData = {
    datasets: [
      {
        label: "Posts",
        data: posts.map((post) => ({
          x: post.upvote_ratio || 0,
          y: post.score || 0,
        })),
        backgroundColor: colors.accent1,
        borderColor: colors.text,
      },
    ],
  };

  // Reliability and Reddit Mentions Gauge (represented as Doughnut charts)
  const reliabilityData = {
    labels: ["Reliable", "Unreliable"],
    datasets: [
      {
        data: dashboardData.is_reliable ? [100, 0] : [0, 100],
        backgroundColor: [colors.reliable, colors.unreliable],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  const redditGaugeData = {
    labels: ["Mentions"],
    datasets: [
      {
        data: [redditMentions, Math.max(100 - redditMentions, 0)],
        backgroundColor: [
          redditMentions > 50
            ? colors.unreliable
            : redditMentions > 25
            ? colors.accent1
            : colors.primary,
          "rgba(0, 0, 0, 0.1)",
        ],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // Site reputation metrics - Bar chart
  const reputationData = {
    labels: ["Reddit Mentions", "Reliability Score"],
    datasets: [
      {
        label: "Values",
        data: [redditMentions, dashboardData.is_reliable ? 100 : 0],
        backgroundColor: [
          colors.primary,
          dashboardData.is_reliable ? colors.reliable : colors.unreliable,
        ],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // Dummy chart data
  const dummyData = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        data: [3, 5, 2, 8],
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.accent1,
          colors.accent2,
        ],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // Gauge chart options (for Doughnut charts)
  const gaugeOptions = {
    ...chartOptions,
    circumference: 180,
    rotation: -90,
    cutout: "70%",
    plugins: {
      ...chartOptions.plugins,
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-4">
        Analysis for {dashboardData.domain}
      </h1>
      <p className="text-gray-300 mb-6">{dashboardData.message}</p>

      {/* Gauge Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl text-white mb-2">Reliability Score</h2>
          <div className="h-48 relative">
            <Doughnut
              data={reliabilityData}
              options={{
                ...gaugeOptions,
                plugins: {
                  ...gaugeOptions.plugins,
                  title: {
                    ...gaugeOptions.plugins.title,
                    text: dashboardData.is_reliable ? "Reliable" : "Unreliable",
                  },
                },
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold">
              {dashboardData.is_reliable ? "100%" : "0%"}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl text-white mb-2">Reddit Mentions</h2>
          <div className="h-48 relative">
            <Doughnut
              data={redditGaugeData}
              options={{
                ...gaugeOptions,
                plugins: {
                  ...gaugeOptions.plugins,
                  title: {
                    ...gaugeOptions.plugins.title,
                    text: `${redditMentions} mentions`,
                  },
                },
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold">
              {redditMentions}
            </div>
          </div>
        </div>
      </div>

      {/* WHOIS and Media Details Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {Object.keys(dashboardData.media_details || {}).length > 0 && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl text-white mb-2">Media Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-2">Attribute</th>
                    <th className="text-left p-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dashboardData.media_details || {}).map(
                    ([key, value], index) => (
                      <tr key={key} className={index % 2 === 1 ? "bg-gray-700" : ""}>
                        <td className="p-2 border-b border-gray-600">{key}</td>
                        <td className="p-2 border-b border-gray-600">{String(value)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {Object.keys(dashboardData.whois_info || {}).length > 0 && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl text-white mb-2">WHOIS Info</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-2">Attribute</th>
                    <th className="text-left p-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dashboardData.whois_info || {})
                    .filter(([k]) =>
                      ["creation_date", "expiration_date", "registrar", "name", "status"].includes(k)
                    )
                    .map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 1 ? "bg-gray-700" : ""}>
                        <td className="p-2 border-b border-gray-600">{key}</td>
                        <td className="p-2 border-b border-gray-600">{String(value)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Domain Timeline */}
      {Object.entries(dashboardData.whois_info || {})
        .filter(([key]) => key.includes("date"))
        .length > 0 && (
        <div className="bg-gray-800 p-4 rounded mt-8">
          <h2 className="text-xl text-white mb-2">Domain Timeline</h2>
          <div className="p-4 text-white">
            <ul className="border-l-2 border-blue-500">
              {Object.entries(dashboardData.whois_info || {})
                .filter(([key]) => key.includes("date"))
                .map(([key, value]) => (
                  <li key={key} className="mb-4 ml-4 relative">
                    <div className="absolute -left-6 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span>📅</span>
                    </div>
                    <div className="ml-6">
                      <h3 className="font-bold">{key}</h3>
                      <p>{new Date(value as string).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* Additional Charts */}
      {posts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Additional Charts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">
                Posts Per Subreddit
              </h3>
              <div className="h-64">
                <Pie
                  data={postsPerSubredditData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Posts Per Subreddit",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">
                Upvote Ratio Per Post
              </h3>
              <div className="h-64">
                <Bar
                  data={upvoteData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Upvote Ratio Per Post",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Score Distribution</h3>
              <div className="h-64">
                <Bar
                  data={scoreData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Score Distribution",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Domain Distribution</h3>
              <div className="h-64">
                <Bar
                  data={domainData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Domain Distribution",
                      },
                    },
                    indexAxis: "y" as const,
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Media Presence</h3>
              <div className="h-64">
                <Pie
                  data={mediaPresenceData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Media Presence",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Title Length per Post</h3>
              <div className="h-64">
                <Scatter
                  data={titleLengthData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Title Length per Post",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Number of Comments</h3>
              <div className="h-64">
                <Bar
                  data={commentsData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Number of Comments per Post",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Upvotes per Post</h3>
              <div className="h-64">
                <Bar
                  data={upsData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Upvotes per Post",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Downvotes per Post</h3>
              <div className="h-64">
                <Bar
                  data={downsData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Downvotes per Post",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Posts by Hour of Day</h3>
              <div className="h-64">
                <Line
                  data={timeData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Posts by Hour of Day",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Upvote Ratio vs Score</h3>
              <div className="h-64">
                <Scatter
                  data={ratioScoreData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Upvote Ratio vs Score",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
              <h3 className="text-xl text-white mb-2">Dummy Chart Example</h3>
              <div className="h-64">
                <Pie
                  data={dummyData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: "Dummy Chart",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reddit Reputation Analysis */}
      <div className="mt-8">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl text-white mb-2">Reddit Reputation Analysis</h2>
          <div className="h-80">
            <Bar
              data={reputationData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Site Reputation Metrics",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}