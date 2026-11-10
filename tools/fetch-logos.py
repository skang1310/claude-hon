#!/usr/bin/env python3
"""Simple Icons(CC0) 패키지에서 브랜드 로고 path를 받아 logos.js 로 묶는다."""
import subprocess, re, json, sys
from concurrent.futures import ThreadPoolExecutor
SLUGS = """claude anthropic
fiverr upwork wix squarespace wordpress medium substack linktree calendly loom evernote buffer bitly gumroad quizlet udemy coursera deepl codecademy envato shutterstock unsplash dribbble behance todoist ghost glitch codepen toggl basecamp tistory velog pinterest patreon kickstarter producthunt
notion slack figma canva jira zendesk grammarly duolingo zoom dropbox asana trello airtable webflow framer miro intercom hubspot mailchimp typeform linear cursor vercel replit zapier stackoverflow daangn karrot toss baemin sketch
adobe salesforce atlassian github shopify sap oracle workday servicenow mckinsey accenture naver kakao kakaotalk coupang netflix uber spotify ibm
microsoft google apple amazon meta nvidia openai samsung tesla
gitlab stripe twilio clickup discord datadog snowflake okta cisco intel paypal line airbnb linkedin dell hp lg hyundai
googlegemini githubcopilot perplexity mistralai x deepseek""".split()
VERS = ['latest', '13.0.0', '11.0.0', '9.21.0', '8.0.0', '6.0.0', '5.0.0', '3.0.0']
def get(slug):
    for v in VERS:
        r = subprocess.run(['curl', '-s', '-f', '--max-time', '15', f'https://cdn.jsdelivr.net/npm/simple-icons@{v}/icons/{slug}.svg'], capture_output=True, text=True)
        if r.returncode == 0 and '<path' in r.stdout:
            m = re.search(r'<path[^>]*\sd="([^"]+)"', r.stdout)
            if m: return slug, m.group(1), v
    return slug, None, None
out, miss = {}, []
with ThreadPoolExecutor(12) as ex:
    for slug, d, v in ex.map(get, SLUGS):
        if d: out[slug] = d
        else: miss.append(slug)
open('logos.js', 'w').write('// Simple Icons (CC0) 에서 가져온 브랜드 로고 path. 상표권은 각 소유자에게 있습니다.\nexport default ' + json.dumps(out, separators=(',', ':')) + ';\n')
print('ok', len(out), 'missing', miss)
