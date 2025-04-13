# main.py
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

# ------- Your Existing Imports and Setup -------
import nltk
nltk.download('punkt')
nltk.download('vader_lexicon')

import pandas as pd
import numpy as np
from urllib.parse import urlparse
from newspaper import Article
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    import textstat
    use_textstat = True
except ImportError:
    use_textstat = False

# Load your data files
unreliable_list_1 = pd.read_csv("filtered_mbfc_fact_1.csv")
unreliable_list_2 = pd.read_csv("filtered_mbfc_fact_2.csv")
UNRELIABLE_DOMAINS = pd.concat([unreliable_list_1['Domain'], unreliable_list_2['Domain']]).dropna().unique().tolist()

# ------- Models and Schemas -------

class ScoreRequest(BaseModel):
    """Schema defining the payload for news scoring."""
    url: str
    reference_summary: Optional[str] = None

class ScoreResponse(BaseModel):
    """Schema defining the response data for news scoring."""
    url: str
    title: str
    domain: str
    source_reliability_score: float
    sentiment_score: float
    readability_score: float
    rouge_score: float
    cosine_similarity: float
    tfidf_score: float
    bias_score: float
    overall_score: float

# ------- Helper / Utility Functions -------

def extract_article(url: str):
    """
    Extracts the article's title, text, and publication date using newspaper3k.
    """
    try:
        article = Article(url)
        article.download()
        article.parse()
        return {
            "title": article.title,
            "text": article.text,
            "authors": article.authors,
            "publish_date": article.publish_date,
            "url": url
        }
    except Exception as e:
        print(f"Error extracting article: {e}")
        return None

def check_source_reliability(domain, unreliable_list):
    if domain.lower() in unreliable_list:
        return 0.0
    else:
        return 1.0

def get_sentiment_score(text):
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    pos = scores['pos']
    neg = scores['neg']
    neu = scores['neu']
    denominator = pos + neg + neu
    if denominator == 0:
        return 0.0
    sentiment = (pos - neg) / denominator
    return sentiment

def get_readability_score(text):
    if use_textstat:
        return textstat.flesch_reading_ease(text)
    else:
        sentences = nltk.sent_tokenize(text)
        words = nltk.word_tokenize(text)
        num_sentences = len(sentences)
        num_words = len(words)
        vowels = "aeiou"
        syllable_count = sum([sum(1 for char in word.lower() if char in vowels) for word in words])
        if num_sentences == 0 or num_words == 0:
            return 0.0
        reading_ease = 206.835 - (1.015 * (num_words / num_sentences)) - (84.6 * (syllable_count / num_words))
        return reading_ease

def get_rouge_score(generated_summary, reference_summary):
    gen_tokens = set(nltk.word_tokenize(generated_summary.lower()))
    ref_tokens = set(nltk.word_tokenize(reference_summary.lower()))
    if not ref_tokens:
        return 0.0
    matches = gen_tokens.intersection(ref_tokens)
    rouge = len(matches) / len(ref_tokens)
    return rouge

def get_cosine_similarity(text1, text2):
    vectorizer = TfidfVectorizer().fit([text1, text2])
    tfidf_matrix = vectorizer.transform([text1, text2])
    cos_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return cos_sim

def get_tfidf_score(text):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text])
    if tfidf_matrix.nnz == 0:
        return 0.0
    return tfidf_matrix.sum() / tfidf_matrix.nnz

def get_bias_score(text, bias_words=None):
    if bias_words is None:
        bias_words = ['liberal', 'conservative', 'fake', 'bias', 'propaganda']
    words = nltk.word_tokenize(text.lower())
    if not words:
        return 0.0
    bias_matches = sum(1 for word in words if word in bias_words)
    return bias_matches / len(words)

def compute_overall_score(source_score, sentiment, readability, rouge, cosine_sim, tfidf, bias):
    """
    If any metric is exactly zero, ignore it in the final weighting.
    """
    norm_sentiment = 1 - abs(sentiment)
    norm_readability = min(max(readability / 100, 0), 1)
    norm_bias = 1 - bias if bias <= 1 else 0

    metrics = {
        "source_score": (source_score, 0.3),
        "sentiment": (norm_sentiment, 0.1),
        "readability": (norm_readability, 0.1),
        "rouge": (rouge, 0.1),
        "cosine_sim": (cosine_sim, 0.1),
        "tfidf": (tfidf, 0.15),
        "bias": (norm_bias, 0.15),
    }

    # Filter out zero-value metrics
    filtered_metrics = {m: (val, wgt) for m, (val, wgt) in metrics.items() if val != 0.0}
    if len(filtered_metrics) == 0:
        return 0.0

    total_weight = sum(wgt for val, wgt in filtered_metrics.values())
    weighted_sum = sum(val * wgt for val, wgt in filtered_metrics.values())

    overall_score = weighted_sum / total_weight
    return overall_score

# ------- FastAPI App -------

app = FastAPI(
    title="News Scoring API",
    description="An API to evaluate news articles based on NLP metrics and source reliability",
    version="1.0.0",
)

@app.post("/score", response_model=ScoreResponse)
def score_article(payload: ScoreRequest):
    """
    POST a JSON body with:
    {
      "url": "https://example.com/news-article",
      "reference_summary": "Optional reference text"
    }
    
    Returns a set of NLP scores plus an overall score.
    By default, similarity and ROUGE are skipped unless 'reference_summary' is provided.
    """
    
    # 1) Parse the Article
    article_data = extract_article(payload.url)
    if not article_data or not article_data["text"]:
        # Return an empty response or raise an HTTPException
        return ScoreResponse(
            url=payload.url,
            title="Extraction Error or Empty Article",
            domain="",
            source_reliability_score=0.0,
            sentiment_score=0.0,
            readability_score=0.0,
            rouge_score=0.0,
            cosine_similarity=0.0,
            tfidf_score=0.0,
            bias_score=0.0,
            overall_score=0.0
        )

    # 2) Check Source Reliability
    domain = urlparse(payload.url).netloc
    source_score = check_source_reliability(domain, UNRELIABLE_DOMAINS)
    
    # 3) Compute NLP Metrics
    text = article_data["text"]
    sentiment = get_sentiment_score(text)
    readability = get_readability_score(text)
    tfidf_score = get_tfidf_score(text)
    bias_score = get_bias_score(text)

    # 4) (Optional) Similarity Metrics
    #    Only compute if user supplies a reference summary
    rouge_score = 0.0
    cosine_sim = 0.0
    if payload.reference_summary and payload.reference_summary.strip():
        rouge_score = get_rouge_score(text, payload.reference_summary)
        cosine_sim = get_cosine_similarity(text, payload.reference_summary)

    # 5) Compute the overall score
    overall_score = compute_overall_score(source_score, sentiment, readability,
                                          rouge_score, cosine_sim,
                                          tfidf_score, bias_score)

    # 6) Prepare the final response
    return ScoreResponse(
        url=article_data["url"],
        title=article_data["title"],
        domain=domain,
        source_reliability_score=source_score,
        sentiment_score=sentiment,
        readability_score=readability,
        rouge_score=rouge_score,
        cosine_similarity=cosine_sim,
        tfidf_score=tfidf_score,
        bias_score=bias_score,
        overall_score=overall_score
    )

# ------- For local development -------
if __name__ == "__main__":
    # Run uvicorn server on localhost:8000
    uvicorn.run(app, host="0.0.0.0", port=8080)
