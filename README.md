
---

# Digi-Rakshak: Multi-Platform Social Media Analytics Dashboard(📄 [Download News Analysis Approach PDF](./hackathon.pdf))

Digi-Rakshak is an integrated analytics platform designed to collect, analyze, and visualize data from multiple social media sources and news outlets. The platform focuses primarily on Twitter data analysis, while also incorporating Reddit and news data to provide a comprehensive view of public sentiment, trending topics, and political bias. Rakshak is built to serve researchers, analysts, and developers interested in harnessing the power of social media and news for data-driven insights.

---

## Table of Contents

- [Introduction](#introduction)
- [Motivation](#motivation)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [File and Directory Structure](#file-and-directory-structure)
- [Installation and Setup](#installation-and-setup)
- [Data Processing Pipeline](#data-processing-pipeline)
- [Visualizations and Reporting](#visualizations-and-reporting)
- [Dashboard Functionality](#dashboard-functionality)
- [Usage](#usage)
- [Customization and Extension](#customization-and-extension)
- [Contributing](#contributing)
- [Future Work](#future-work)
- [License and Acknowledgments](#license-and-acknowledgments)
- [Contact](#contact)
---

## video :
1. news article :
2.  twitter  operations :
3. reddit operations :
https://drive.google.com/drive/folders/1-MxTBKAqpKGU_-CItFsLAs-h8wKpYVMC

## system   design :

![image](https://github.com/user-attachments/assets/35144b4b-02e1-4bb5-abd5-900f28ea6f97)


## user flow:
   ![image](https://github.com/user-attachments/assets/2d6fb67f-2f9c-48ef-9a60-6c56b7f5b177)

## novel approach user flow:
  ![image](https://github.com/user-attachments/assets/cf1d0aa4-9e98-4b03-ad6f-77eac0efd3ac)



## screenshots:
![Landing_Page](https://github.com/user-attachments/assets/a2f4d0bb-3d6b-4045-be6b-14616447093d)

![image](https://github.com/user-attachments/assets/355c783a-425e-474c-b119-54d59bcee033)

![image](https://github.com/user-attachments/assets/8d87d44f-5b81-4e10-b89e-6dc7f0ac5dd0)

![image](https://github.com/user-attachments/assets/8a396e1f-003d-4f6c-b494-871ba809b379)

![image](https://github.com/user-attachments/assets/1f0fe507-4d38-4d06-8421-ae40e7843078)

 ![Reddit](https://github.com/user-attachments/assets/ea2eed9b-21d4-4ceb-a682-d4547917dc81)

![Uploading image.png…]()

---

## Introduction

Digi-Rakshak is a multi-faceted analytics dashboard that merges data from Twitter, Reddit, and news sources. By combining robust backend data processing with an interactive, modern frontend, the platform enables users to:

- Monitor daily trends and track sentiment evolution.
- Analyze political bias and term co-occurrence within social media content.
- Explore network visualizations and geographic distributions of user activity.
- Integrate multiple data sources to derive a holistic view of current events and public discourse.

---

## Motivation

In today’s fast-paced digital landscape, information flows continuously from diverse sources. Traditional analytics platforms often focus on a single data channel, limiting insights. Digi-Rakshak addresses this gap by:
- **Unifying Data Sources:** Integrating Twitter, Reddit, and news data for cross-platform insights.
- **Enhancing Decision Making:** Providing real-time analytics for informed strategic decisions.
- **Empowering Research:** Offering detailed, reproducible analysis for academic and commercial research.
- **Improving User Engagement:** Delivering interactive visualizations that engage and empower users.

---

## Features

- **Multi-Platform Data Integration:** Aggregates Twitter, Reddit, and news data.
- **Sentiment Analysis:** Detailed sentiment trends visualized over time.
- **Political Bias Detection:** Comparative analysis of sentiment and political leanings.
- **Network and Co-occurrence Analysis:** Visual representations of term and user interaction networks.
- **Interactive Dashboards:** Dynamic, responsive dashboards built with modern web frameworks.
- **Data Visualization:** Comprehensive charts, heatmaps, word clouds, and geographic maps.
- **Scalable Architecture:** Modular backend scripts and frontend components that can be extended.

---

## Architecture

Digi-Rakshak is organized into two primary modules:

### 1. Twitter Analysis Module
- **Data Sources:**  
  - `tweets.csv`, `analyzed_tweets.csv`, `users.csv` for raw and processed tweet data.
  - Supplementary files such as `reddit_data.csv` and `social_media_data.csv`.
- **Backend Processing:**  
  - Python scripts (`backend.py`, `bc*.py`, `fn*.py`) for data ingestion, cleaning, sentiment, and network analysis.
- **Visualization Outputs:**  
  - Static images (e.g., `cooccurrence_heatmap.png`, `sentiment_time_series.png`) and interactive HTML visualizations (e.g., `tweet_locations.html`).

### 2. News and Reddit Analysis Module
- **Data Sources:**  
  - News datasets (`filtered_mbfc_fact_1.csv`, `filtered_mbfc_fact_2.csv`) and Reddit data (`reddit_data.csv`).
- **Backend Processing:**  
  - Scripts in the `G5_RajatMasanagi-main/backend` folder including a dedicated news check module.
- **Frontend Dashboard:**  
  - Built using Next.js and React, with reusable components for Twitter, Reddit, and news analytics.

Both modules are connected through a unified dashboard, allowing seamless switching between data types and analytical views.

---

## Technology Stack

- **Backend:** Python 3.x  
  - Data processing, cleaning, and analysis using custom scripts.
  - Dependencies managed via `requirements.txt`.
- **Frontend:** Next.js (React)  
  - Modern, responsive UI components.
  - Styling and interactive charts powered by libraries like Vis Network and Tom Select.
- **Data Visualization:**  
  - Static and interactive visualizations including heatmaps, time series, and geographic maps.
- **Version Control:** Git  
  - Modular and scalable code architecture designed for collaborative development.

---

## File and Directory Structure

### Twitter Analysis Module (Rakshak)

```
user4/
├── analyzed_tweets.csv            # Processed tweets with analysis outputs.
├── tweets.csv                     # Raw tweet data.
├── users.csv                      # User information.
├── reddit_data.csv                # Reddit data integrated with Twitter analysis.
├── social_media_data.csv          # Additional social media datasets.
├── filtered_mbfc_fact_1.csv       # Curated filtered data.
├── x.com.json                     # Supplementary external data.
│
├── backend.py                     # Main backend processing script.
├── frontend.py                    # Frontend dashboard interface code.
├── bc1.py ... bc6.py              # Backend modules for various analysis tasks.
├── fn.py ... fn6.py               # Functional scripts for data cleaning and visualizations.
├── main.ipynb                     # Jupyter Notebook for interactive prototyping.
├── twitter_analysis_report.md     # Detailed analysis report.
├── requirements.txt               # Python dependencies.
│
├── cooccurrence_heatmap.png       # Heatmap visualization of term co-occurrence.
├── daily_tweet_count_trend.png    # Chart showing daily tweet volume.
├── political_distribution.png     # Visualization of political bias.
├── sentiment_time_series.png      # Time series of sentiment analysis.
├── sentiment_trend.png            # Overall sentiment trends.
├── sentiment_vs_politics.png      # Comparative sentiment vs. political leaning.
├── top_languages.png              # Distribution of languages in tweets.
├── wordcloud.png                  # Word cloud of tweet content.
│
├── term_cooccurrence_graph.html   # Interactive term co-occurrence graph.
├── tweet_locations.html           # Map displaying tweet locations.
├── tweet_time_series.html         # Interactive time series visualization.
├── tweet_time_series_map.html     # Map-based time series visualization.
├── user_locations_map.html        # Map of user locations.
│
└── lib/                           # Frontend libraries and assets.
    ├── bindings/
    │   └── utils.js               # Utility functions.
    ├── tom-select/
    │   ├── tom-select.complete.min.js
    │   └── tom-select.css
    └── vis-9.1.2/
        ├── vis-network.min.js
        └── vis-network.css
```

### News and Reddit Analysis Module (G5_RajatMasanagi)

```
G5_RajatMasanagi-main/
├── backend/
│   ├── backend.py                 # Main backend processing script.
│   ├── data.json                  # Configuration/data storage.
│   ├── filtered_mbfc_fact_1.csv   # Filtered news dataset.
│   ├── filtered_mbfc_fact_2.csv   # Additional news data.
│   ├── main.py                    # Entry point for backend processing.
│   ├── news_check/                # News analysis sub-module.
│   │   ├── agent/
│   │   │   └── main2.py           # News agent script.
│   │   ├── filtered_mbfc_fact_1.csv
│   │   ├── filtered_mbfc_fact_2.csv
│   │   ├── main.py                # Main script for news check.
│   │   └── requirements.txt       # Dependencies for news checking.
│   ├── reddit_data.csv            # Reddit data for analysis.
│   └── requirements.txt           # Backend dependencies.
│
├── frontend/
│   ├── .gitignore
│   ├── README.md                  # Frontend-specific documentation.
│   ├── eslint.config.mjs
│   ├── next.config.ts             # Next.js configuration.
│   ├── package-lock.json
│   ├── package.json               # Node.js dependencies.
│   ├── postcss.config.mjs
│   ├── public/                    # Static assets (SVGs, images).
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── sharechat.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # Reusable UI components.
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Icons.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── components/dashboard-twitter/
│   │   │   │   └── Chart.jsx      # Chart component for Twitter dashboard.
│   │   │   ├── dashboard-news/
│   │   │   │   └── page.tsx       # News dashboard page.
│   │   │   ├── dashboard-reddit/
│   │   │   │   └── page.tsx       # Reddit dashboard page.
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css        # Global CSS styles.
│   │   │   ├── layout.tsx         # Layout component.
│   │   │   └── page.tsx           # Main landing page.
│   ├── tsconfig.json              # TypeScript configuration.
│
└── hackathon.pdf                  # Project pitch and documentation.
```

---

## Installation and Setup

### Prerequisites

- **Backend:**  
  - Python 3.7+  
  - pip

- **Frontend:**  
  - Node.js (v12 or later) and npm (or yarn)  
  - Modern web browser

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://your-repository-link.git
   cd your-repository-folder
   ```

2. **Install Python Dependencies:**
   - For the Twitter Analysis module:
     ```bash
     pip install -r user4/requirements.txt
     ```
   - For the News/Reddit module:
     ```bash
     cd G5_RajatMasanagi-main/backend
     pip install -r requirements.txt
     ```
   - If necessary, install news check dependencies:
     ```bash
     cd news_check
     pip install -r requirements.txt
     ```

3. **Run Backend Servers:**
   - **Twitter Analysis:**
     ```bash
     python user4/backend.py
     ```
   - **News/Reddit Analysis:**
     ```bash
     cd G5_RajatMasanagi-main/backend
     python main.py
     ```

### Frontend Setup

1. **Install Node.js Dependencies:**
   ```bash
   cd G5_RajatMasanagi-main/frontend
   npm install
   ```

2. **Run the Frontend Dashboard:**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Alternative Testing:**
   - Open individual HTML files (e.g., `tweet_time_series.html`) in your browser for component testing.

### Interactive Analysis

- **Jupyter Notebook:**
  For rapid prototyping and custom analyses, launch the notebook:
  ```bash
  jupyter notebook user4/main.ipynb
  ```

---

## Data Processing Pipeline

Digi-Rakshak employs a modular pipeline for data processing:

1. **Data Collection:**
   - **Twitter:**  
     Data is ingested from `tweets.csv` with processed outputs in `analyzed_tweets.csv`.
   - **Reddit:**  
     Aggregated data available in `reddit_data.csv`.
   - **News:**  
     Data from news sources is filtered and curated (e.g., `filtered_mbfc_fact_1.csv`, `filtered_mbfc_fact_2.csv`).

2. **Data Cleaning and Preprocessing:**
   - Functional scripts (`fn.py` to `fn6.py`) clean, deduplicate, and filter the datasets.
   - Specific modules ensure quality data input for subsequent analysis.

3. **Analytical Modules:**
   - **Sentiment Analysis:**  
     Utilizes scripts (bc1.py to bc6.py) to evaluate tweet sentiments and generate time series (`sentiment_time_series.png`, `sentiment_trend.png`).
   - **Political Bias & Network Analysis:**  
     Comparative analyses are performed and visualized (e.g., `political_distribution.png`, `sentiment_vs_politics.png`, `cooccurrence_heatmap.png`).
   - **News and Reddit Analysis:**  
     Separate modules process news and Reddit data, integrating their insights into the unified dashboard.

4. **Visualization & Reporting:**
   - Both static (PNG images) and interactive (HTML) visualizations are generated.
   - Detailed reporting is documented in `twitter_analysis_report.md` and additional project reports.

---

## Visualizations and Reporting

### Key Visualizations

- **Twitter Visualizations:**
  - **Co-occurrence Heatmap:**  
    Illustrates the frequency with which key terms appear together.
  - **Daily Tweet Count Trend:**  
    Highlights tweet volume changes over time.
  - **Sentiment Analysis:**  
    Displays sentiment fluctuations via time series and trend graphs.
  - **Network Graphs:**  
    Interactive term co-occurrence and user interaction networks.
  - **Geographic Maps:**  
    Interactive maps showing tweet origins and user locations.

- **News and Reddit Visualizations:**
  - **News Dashboard:**  
    Displays sentiment and topical trends in news data.
  - **Reddit Dashboard:**  
    Visualizes Reddit trends and community discussions.

- **Supporting Visuals:**
  - **Word Cloud:**  
    Represents the frequency of words in the dataset.
  - **Language Distribution:**  
    Shows the distribution of tweet languages.

---

## Dashboard Functionality

The Digi-Rakshak dashboard is built to provide an engaging, interactive user experience:

- **Real-Time Data:**  
  Automatically updates visualizations with the latest data.
- **Interactive Filtering:**  
  Allows users to filter by time frame, topic, language, or sentiment.
- **Multi-Source Navigation:**  
  Easily switch between Twitter, news, and Reddit data views.
- **Responsive Design:**  
  Optimized for both desktop and mobile devices.

---

## Usage

### Running the Dashboard

1. **Start Backend Services:**
   - Ensure that both Twitter and News/Reddit backends are running.
2. **Launch Frontend:**
   - Access the dashboard via the provided URL ([http://localhost:3000](http://localhost:3000)).
3. **Interact with Visualizations:**
   - Use dashboard filters and interactive elements to explore data insights.

### Custom Queries and Analysis

- **Interactive Notebook:**  
  Use the Jupyter Notebook for custom data exploration.
- **API Access:**  
  Backend endpoints allow programmatic access to processed data for integration with other tools.

---

## Customization and Extension

Digi-Rakshak’s modular design allows for easy customization:

- **Extend Analytical Modules:**  
  Add new Python scripts (e.g., additional `bc*.py` or `fn*.py` files) to integrate advanced analytics.
- **UI/UX Modifications:**  
  Adjust frontend components by modifying React/Next.js files in `frontend/src/app`.
- **Data Source Expansion:**  
  Integrate new data sources by updating configuration files (e.g., `data.json`) and modifying the data ingestion pipeline.

---

## Contributing

We welcome contributions to enhance Rakshak! To contribute:

1. **Fork the Repository:**  
   Create your own branch for changes.
2. **Submit Pull Requests:**  
   Follow our coding guidelines and commit messages.
3. **Report Issues:**  
   Use GitHub Issues for bug reports and feature requests.

For detailed contribution guidelines, please refer to the CONTRIBUTING.md file (if available).

---

## Future Work

Planned enhancements for Rakshak include:

- **Scalability Improvements:**  
  Integrate big data tools like Apache Spark for processing larger datasets.
- **Real-Time Streaming:**  
  Implement real-time data ingestion for more dynamic updates.
- **Advanced Analytics:**  
  Incorporate deep learning techniques for sentiment and network analysis.
- **Expanded Data Integration:**  
  Add more social media platforms and news sources to broaden analysis scope.

---

## License and Acknowledgments

Digi-Rakshak is licensed under the [MIT License](LICENSE).  
Special thanks to:
- **Open-Source Libraries:**  
  Tom Select, Vis Network, and other libraries that power our visualizations.
- **Data Providers:**  
  Twitter, Reddit, and news agencies for providing the raw data.
- **Contributors:**  
  All team members and community contributors who made this project possible.

---

## Contact

For questions, support, or contributions, please reach out via:
- **Email:** [your.email@example.com](mailto:your.email@example.com)
- **GitHub:** [github.com/yourusername](https://github.com/yourusername)
- **Project Website:** [yourprojectsite.com](https://yourprojectsite.com)

---


