import re

class TextProcessor:
    def __init__(self, keywords=None):
        self.keywords = keywords if keywords else []

    def get_paragraph(self, text):
      """Lấy nội dung sau dấu | |"""
      match = re.search(r"\|.*?\|\s*(.*)", text) 
      return match.group(1) if match else ""  
    
    def extract_words_from_pipes(self, text):
        """Trích xuất các từ bên trong dấu | | rồi đưa vào mảng"""
        match = re.search(r"\|(.*?)\|", text) 
        if not match:
            return []  
        
        words = match.group(1).split(",")  
        return [word.strip() for word in words]
    
    def compare_word_in_list(self, list1, list2):
        """Kiểm tra các từ giống nhau trong 2 mảng"""
        return bool(set(list1) & set(list2))

#instance of class
textProcessor = TextProcessor()
if __name__ == "__main__":
      # test function
      listKey = textProcessor.extract_words_from_pipes("|Unauthorized, Auction, Error|")
      listKeyword = textProcessor.extract_words_from_pipes("|Unauthorized, Auction, Warning|vcc ehehehe")
      context = textProcessor.get_paragraph("|Unauthorized, Auction| vcc zzzzzzzzzzz")
      compare_list = textProcessor.compare_word_in_list(listKey, listKeyword)
      print(listKeyword)
      print(context)
      print(compare_list)