from functools import lru_cache
import requests
import time
import json
from google import genai


@lru_cache(maxsize=100)
def geminiAI(message, max_retries=3):
    for attempt in range(1, max_retries + 1):
        try:
            client = genai.Client(api_key="AIzaSyBq93aQNxtgm84pryEgIUZBEtxBLBuCCQ0")

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[message])
            
            if len(response.text) > 0:
                print(response.text)
                return response.text.strip()
            
            print(f"{attempt}: API trả về dữ liệu không hợp lệ.")
        except requests.exceptions.RequestException as e:
            print(f"{attempt}: Lỗi khi gọi API DeepSeek - {e}")

        time.sleep(2)  

    return "AI không thể xử lý yêu cầu sau nhiều lần thử."