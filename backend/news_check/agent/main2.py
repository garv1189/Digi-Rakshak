import requests
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI


llm_gemini = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key="AIzaSyBQjwl1U4208zTqqoOvAhjo98ypbCs8Pk4"
)

def extract_claims_from_url(url):
    """Extracts key factual claims from a news article using Gemini."""
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        text = " ".join(p.get_text() for p in paragraphs)[:3000]  # Extract up to 3000 chars

        # Use Gemini to extract key claims
        prompt = f"Extract the key factual claims from the following news article:\n\n{text}"
        claims_response = llm_gemini.invoke(prompt)

        if claims_response and claims_response.content:
            claims = claims_response.content.split("\n")  # Split into individual claims
            return [c.strip() for c in claims if c.strip()]  # Remove empty claims
        return []
    
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

GOOGLE_API_KEY = "AIzaSyC_HBE7RG8cNcd6VVEyTHgL0IMyQMW6t6E"
GOOGLE_CSE_ID = "e72b8b8cf01084246"

NEWS_SITES = [
    "bbc.com", "cnn.com", "reuters.com", "nytimes.com",
    "theguardian.com", "apnews.com", "npr.org", "washingtonpost.com",
    "aljazeera.com", "forbes.com", "bloomberg.com"
]

def search_google(query):
    """Searches Google for evidence related to a claim from top news sources."""
    news_filter = " OR ".join([f"site:{site}" for site in NEWS_SITES])
    query = f"{query} {news_filter}"  # Optimize query for news sources

    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "key": GOOGLE_API_KEY,
        "cx": GOOGLE_CSE_ID,
        "num": 5  # Get top 5 search results
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        results = response.json().get("items", [])
        return [r["link"] for r in results]  # Return result URLs
    except requests.RequestException as e:
        print(f"Error with Google Search: {e}")
        return []

from langchain.prompts import PromptTemplate

import time
from langchain.prompts import PromptTemplate

# Store previous verification results to avoid redundant API calls
cache = {}

def verify_claims(claims):
    """Verifies multiple claims extracted from a news article while handling API limits."""
    results = {}

    for claim in claims:
        if claim in cache:
            # Use cached result if available
            results[claim] = cache[claim]
            continue

        # Introduce a delay to prevent hitting API rate limits
        time.sleep(2)

        search_results = search_google(claim)
        evidence_texts = [extract_claims_from_url(url) for url in search_results if url]
        print(f"Evidence for claim '{claim}': {evidence_texts}")
        
        flattened_evidence = []
        for e in evidence_texts:
            if isinstance(e, list):
                flattened_evidence.extend(e)
            elif isinstance(e, str):
                flattened_evidence.append(e)

        evidence = "\n\n".join(flattened_evidence) if flattened_evidence else "No relevant evidence found."

        prompt = PromptTemplate(
    input_variables=["claim", "evidence"],
    template="""
    Claim: {claim}
    
    Evidence: {evidence}
    
    Based on the evidence, provide a misinformation score between 0-100.
    
    - 0 = Completely Reliable
    - 100 = Highly Misinformed
    - Consider factors like credibility, source verification, and contradictions.
    
    Only return:
    "Misinformation Score: X/100 - [Short reason]"
    """
)


        try:
            response = llm_gemini.invoke(prompt.format(claim=claim, evidence=evidence))
            results[claim] = response.content if response else "Verification failed"
            cache[claim] = results[claim]  # Store in cache
        except Exception as e:
            print(f"Error with Gemini API: {e}")
            results[claim] = "API Limit Exceeded - Please Try Again Later"

    return results


from fastapi import FastAPI

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for all origins (for testing; restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including POST
    allow_headers=["*"],  # Allows all headers
)


@app.get("/verify")
def verify_article(url: str):
    """API endpoint that extracts claims from a news article and verifies them."""
    claims = extract_claims_from_url(url)

    if not claims:
        return {"error": "No factual claims extracted from the article."}

    verification_results = verify_claims(claims)

    return {
        "article_url": url,
        "extracted_claims": claims,
        "verification_results": verification_results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)
