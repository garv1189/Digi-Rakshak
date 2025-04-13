from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import whois
import validators
from urllib.parse import urlparse
import requests
import csv
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import json
app = FastAPI(
    title="News Reliability Checker API",
    description="API to verify if a news URL is from a known unreliable source and return additional info.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your CSV file with known unreliable sources
df = pd.read_csv(r"filtered_mbfc_fact_1.csv")
df['Domain'] = df['Domain'].str.lower()

class CheckNewsResponse(BaseModel):
    is_reliable: bool
    message: str
    domain: str
    whois_info: dict = None
    media_details: dict = None
    social_media_stats: dict = None

def extract_domain(url: str) -> str:
    """
    Extract the domain from the provided URL.
    """
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

def get_reddit_mentions(url: str) -> int:
    """
    Retrieve the number of Reddit posts mentioning the URL.
    """
    endpoint = f"https://www.reddit.com/api/info.json?url={url}"
    headers = {'User-agent': 'Mozilla/5.0'}
    try:
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status()
        data = response.json()
        # with open("data.json", "w") as json_file:
        #     json.dump(data, json_file, indent=4)
        # print(data)
        posts = data.get('data', {}).get('children', [])
        return len(posts)
    except Exception as e:
        print(f"Error retrieving Reddit mentions: {e}")
        return 0

def save_reddit_data_to_csv(url: str, reddit_mentions: int):
    """
    Save the fetched Reddit data to a CSV file dynamically.
    The CSV file will have columns: url, reddit_mentions, timestamp.
    """
    filename = "reddit_data.csv"
    file_exists = os.path.isfile(filename)
    with open(filename, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            # Write header if file does not exist.
            writer.writerow(["url", "reddit_mentions", "timestamp"])
        timestamp = datetime.utcnow().isoformat()
        writer.writerow([url, reddit_mentions, timestamp])

@app.get("/check_news", response_model=CheckNewsResponse)
def check_news(url: str):
    """
    Check the reliability of a given news article URL.
    Steps:
      1. Validate the URL.
      2. Extract the domain.
      3. Check the domain against the known unreliable sources dataset.
      4. Retrieve WHOIS info for additional domain data.
      5. Retrieve Reddit mentions for the URL and save that data to CSV.
    """
    # Validate URL
    if not validators.url(url):
        raise HTTPException(status_code=400, detail="Invalid URL provided.")
    
    domain = extract_domain(url)
    match = df[df['Domain'] == domain]
   
    try:
        whois_info = whois.whois(url)
        if isinstance(whois_info, dict):
            whois_info = {k: str(v) for k, v in whois_info.items() if v is not None}
        else:
            whois_info = {}
    except Exception as e:
        whois_info = {"error": f"Could not retrieve WHOIS info: {str(e)}"}
    
    if not match.empty:
        message = "This website is in the list of known unreliable sources."
        is_reliable = False
        media_details = {
            "Name": match.iloc[0]['Name'],
            "MBFC Fact": match.iloc[0]['MBFC Fact'],
            "MBFC Bias": match.iloc[0]['MBFC Bias'],
            "Media Bias/Fact Check": match.iloc[0]['Media Bias/Fact Check'],
        }
    else:
        message = "No flagged misinformation detected."
        is_reliable = True
        media_details = {}
    
    reddit_mentions = get_reddit_mentions(url)
    # Save the Reddit fetch data to a CSV file dynamically.
    save_reddit_data_to_csv(url, reddit_mentions)
    
    social_media_stats = {
        "reddit_mentions": reddit_mentions
    }
    
    return CheckNewsResponse(
        is_reliable=is_reliable,
        message=message,
        domain=domain,
        whois_info=whois_info,
        media_details=media_details,
        social_media_stats=social_media_stats
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
