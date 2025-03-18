from functools import lru_cache
import requests
import time

@lru_cache(maxsize=100)
def deepSeekAI(message, max_retries=3):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hifiveplus.com",
        "X-Title": "hifiveplus",
    }
    payload = {
        "model": "deepseek/deepseek-chat:free",
        "messages": [{"role": "user", "content": message}]
    }

    for attempt in range(1, max_retries + 1):
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            response.raise_for_status()  

            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                print(data["choices"][0]["message"]["content"])
                return data["choices"][0]["message"]["content"]
            
            print(f"{attempt}: API trả về dữ liệu không hợp lệ.")
        except requests.exceptions.RequestException as e:
            print(f"{attempt}: Lỗi khi gọi API - {e}")

        time.sleep(2)  

    return "AI không thể xử lý yêu cầu sau nhiều lần thử."

if __name__ == '__main__':
    deepSeekAI("hello?")