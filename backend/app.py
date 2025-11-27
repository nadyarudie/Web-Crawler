# app.py
# Backend for Arachne's Lens using Flask with streaming for real-time progress

import re
import time
import json
import requests
from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Initialize Flask App
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# --- CONFIGURATION ---
MAX_PAGES_TO_CRAWL = 50
SENSITIVE_KEYWORDS = ['password', 'api_key', 'secret', 'token', 'passwd', 'credentials']
DEV_COMMENT_KEYWORDS = ['TODO', 'FIXME', 'BUG', 'HACK']

# --- HELPER FUNCTIONS ---

def is_valid_url(url):
    """Checks if a URL has a valid format."""
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

def get_all_website_links(url, session):
    """
    Crawls a given URL and returns all unique links found on the page.
    """
    urls = set()
    try:
        response = session.get(url, timeout=5)
        soup = BeautifulSoup(response.content, "html.parser")
        
        for a_tag in soup.findAll("a"):
            href = a_tag.attrs.get("href")
            if not href:
                continue
            
            href = urljoin(url, href)
            
            if "#" in href:
                href = href.split("#")[0]

            if is_valid_url(href):
                urls.add(href)
        return list(urls)
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

def scan_html_for_sensitive_data(url, html_content):
    """
    Scans the raw HTML of a page for sensitive information.
    """
    findings = []
    
    # Find Email Addresses
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', html_content)
    for email in set(emails):
        findings.append({
            'severity': 'Medium', 'category': 'Email Address', 'url': url,
            'finding': email, 'line': f'Found email: {email}'
        })

    # Find Developer Comments
    for keyword in DEV_COMMENT_KEYWORDS:
        matches = re.finditer(f'.*({keyword}).*', html_content, re.IGNORECASE)
        for match in matches:
            findings.append({
                'severity': 'Low', 'category': 'Developer Comment', 'url': url,
                'finding': keyword, 'line': match.group(0).strip()
            })

    # Find Dangerous Keywords
    for keyword in SENSITIVE_KEYWORDS:
        matches = re.finditer(f'.*({keyword}).*', html_content, re.IGNORECASE)
        for match in matches:
            if 'password' in match.group(0).lower() and 'type="password"' in match.group(0).lower():
                continue
            findings.append({
                'severity': 'High', 'category': 'Dangerous Keyword', 'url': url,
                'finding': keyword, 'line': match.group(0).strip()
            })
            
    return findings

# --- MAIN STREAMING SCANNER ---

def generate_scan_updates(start_url):
    """
    A generator function that yields real-time updates during the scan.
    """
    base_domain = urlparse(start_url).netloc
    urls_to_crawl = {start_url}
    crawled_urls = set()
    
    broken_links_report = []
    sensitive_info_report = []
    
    with requests.Session() as session:
        session.headers.update({'User-Agent': 'ArachneLens-Crawler/1.0'})

        total_urls_found = 1

        while urls_to_crawl and len(crawled_urls) < MAX_PAGES_TO_CRAWL:
            url = urls_to_crawl.pop()
            if url in crawled_urls:
                continue
            
            crawled_urls.add(url)
            
            # Yield progress update
            progress = min(99, int((len(crawled_urls) / total_urls_found) * 100))
            yield json.dumps({"type": "progress", "crawled_url": url, "progress": progress}) + '\n'
            time.sleep(0.1) # Simulate work

            try:
                response = session.get(url, timeout=5)
                
                sensitive_findings = scan_html_for_sensitive_data(url, response.text)
                sensitive_info_report.extend(sensitive_findings)

                all_links_on_page = get_all_website_links(url, session)

                for link in all_links_on_page:
                    if base_domain in urlparse(link).netloc and link not in crawled_urls and link not in urls_to_crawl:
                        urls_to_crawl.add(link)
                        total_urls_found = len(crawled_urls) + len(urls_to_crawl)
                    
                    try:
                        link_response = session.head(link, timeout=3, allow_redirects=True)
                        if link_response.status_code >= 400:
                            broken_links_report.append({
                                'status': link_response.status_code, 'url': link,
                                'sourceText': f'Found on {url}'
                            })
                    except requests.RequestException:
                         broken_links_report.append({
                                'status': 404, 'url': link,
                                'sourceText': f'Found on {url}'
                            })

            except requests.RequestException as e:
                broken_links_report.append({
                    'status': 500, 'url': url, 'sourceText': 'Initial URL'
                })
    
    # Yield final results
    final_result = {
        "type": "result",
        "data": {
            "broken_links": broken_links_report,
            "sensitive_info": sensitive_info_report
        }
    }
    yield json.dumps(final_result) + '\n'


@app.route('/scan', methods=['POST'])
def scan_website():
    start_url = request.json.get('url')
    if not start_url or not is_valid_url(start_url):
        return Response(json.dumps({"error": "A valid URL is required"}), status=400, mimetype='application/json')
        
    return Response(stream_with_context(generate_scan_updates(start_url)), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
