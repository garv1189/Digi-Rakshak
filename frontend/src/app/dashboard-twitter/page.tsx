"use client";
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, MessageSquare, TrendingUp, Eye } from 'lucide-react';

const TwitterDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const engagementData = [
    { date: 'Mar 1', likes: 1240, retweets: 840, comments: 620 },
    { date: 'Mar 2', likes: 1350, retweets: 750, comments: 580 },
    { date: 'Mar 3', likes: 1480, retweets: 920, comments: 730 },
    { date: 'Mar 4', likes: 1220, retweets: 680, comments: 510 },
    { date: 'Mar 5', likes: 1390, retweets: 830, comments: 690 },
    { date: 'Mar 6', likes: 1670, retweets: 1020, comments: 780 },
    { date: 'Mar 7', likes: 1890, retweets: 1250, comments: 940 },
  ];
  const followerGrowthData = [
    { date: 'Feb 24', followers: 12680 },
    { date: 'Feb 25', followers: 12720 },
    { date: 'Feb 26', followers: 12790 },
    { date: 'Feb 27', followers: 12880 },
    { date: 'Feb 28', followers: 12970 },
    { date: 'Mar 1', followers: 13080 },
    { date: 'Mar 2', followers: 13220 },
    { date: 'Mar 3', followers: 13410 },
    { date: 'Mar 4', followers: 13590 },
    { date: 'Mar 5', followers: 13780 },
    { date: 'Mar 6', followers: 14020 },
    { date: 'Mar 7', followers: 14320 },
  ];
  
  // Dummy data for audience demographics
  const audienceDemographicsData = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 20 },
    { name: '45-54', value: 12 },
    { name: '55+', value: 8 },
  ];
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  // Dummy data for sentiment analysis
  const sentimentData = [
    { name: 'Positive', value: 58 },
    { name: 'Neutral', value: 27 },
    { name: 'Negative', value: 15 },
  ];
  
  const SENTIMENT_COLORS = ['#4ade80', '#94a3b8', '#f87171'];
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-blue-400 text-2xl">
                <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </div>
              <h1 className="text-xl font-bold">Twitter Analytics Dashboard</h1>
            </div>
            <div className="inline-flex bg-gray-800 rounded-lg p-1">
              <button 
                onClick={() => setTimeRange('24h')}
                className={`px-3 py-1 text-sm rounded-md ${timeRange === '24h' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                24h
              </button>
              <button 
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-sm rounded-md ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                7d
              </button>
              <button 
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 text-sm rounded-md ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                30d
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Total Tweets</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <MessageSquare size={20} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">3,849</p>
                <p className="text-sm text-green-400 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12.5%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Followers</h3>
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <Users size={20} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">14,320</p>
                <p className="text-sm text-green-400 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +8.3%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Engagement Rate</h3>
              <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                <Activity size={20} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">4.7%</p>
                <p className="text-sm text-green-400 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +1.2%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Impressions</h3>
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                <Eye size={20} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">567K</p>
                <p className="text-sm text-green-400 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +18.7%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart 1: Engagement Over Time */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Engagement Over Time</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#f3f4f6',
                  }}
                />
                <Legend />
                <Bar dataKey="likes" name="Likes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retweets" name="Retweets" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" name="Comments" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 2: Follower Growth */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Follower Growth</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#f3f4f6',
                  }}
                />
                <Area type="monotone" dataKey="followers" stroke="#3b82f6" fillOpacity={1} fill="url(#followersGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Chart 3 & 4: Demographics and Sentiment in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Chart 3: Audience Demographics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Audience Demographics</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceDemographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {audienceDemographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#f3f4f6',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Chart 4: Sentiment Analysis */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Sentiment Analysis</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#f3f4f6',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Chart 5: Top Hashtags */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Top Hashtags</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['#AI', '#DataScience', '#MachineLearning', '#Python', '#BigData'].map((tag, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <p className="text-blue-400 font-medium mb-2">{tag}</p>
                <p className="text-2xl font-bold mb-1">{1240 - (index * 120)}</p>
                <p className="text-xs text-green-400">+{23 - (index * 3)}%</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TwitterDashboard;