# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv
#from .restapis import get_request, analyze_review_sentiments, post_review

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="https://shrutikapat1-3030.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="https://sentianalyzer.21p0jgbif1u7.us-south.codeengine.appdomain.cloud/")

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params += key + "=" + value + "&"
    request_url = backend_url + endpoint + "?" + params
    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return None

def analyze_review_sentiments(text):
    if not text:
        return {'sentiment': 'unknown'}
    request_url = sentiment_analyzer_url + "analyze/" + str(text)
    try:
        response = requests.get(request_url)
        response.raise_for_status()
        return response.json()
    except Exception as err:
        print(f"Sentiment API error: {err}")
        return {'sentiment': 'unknown'}

def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Network exception occurred: {e}")
        return {"status": "error"}