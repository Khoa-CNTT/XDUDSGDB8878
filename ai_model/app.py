import subprocess
import sys
from flask import Flask, request, jsonify
import pickle
import traceback
from deepseek_ai import deepSeekAI 
from gemini_ai import geminiAI 
import random
from utils import textProcessor, TextProcessor

app = Flask(__name__)


# Load the AI model
try:
    with open('ai_model.pkl', 'rb') as f:
        model = pickle.load(f)
        print("Model loaded successfully.")
except Exception as e:
    print("Error loading model:", e)
    model = None

def is_numeric(s):
    return s.isdigit()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Parse input JSON
        if not data or 'text' not in data:
            return jsonify({"error": "Message input is required"}), 400
        
        # Perform prediction
        message = data['text'].strip()

        print("message request: ", message)

        contextMsg = textProcessor.get_paragraph(message)
        matchKeys = textProcessor.extract_words_from_pipes(message)
        keywords = textProcessor.extract_words_from_pipes(message)

        if textProcessor.compare_word_in_list(matchKeys, keywords):
            response = {
                "result": geminiAI(f"{contextMsg}").strip(),
            }
            return jsonify({"prediction": response})
        if not model:
            return jsonify({"error": "Model not loaded"}), 500

        prediction = model.predict([message])[0]
        print("Raw prediction:", prediction)
        # Parse prediction result
        try:
            address, district, province, name, acreage, number_of_basement, description = prediction.split('|')
            response = {
                "address": address.strip(),
                "district": district.strip(),
                "province": province.strip(),
                "name": name.strip(),
                "acreage": int(acreage.strip()),
                "number_of_basement": int(number_of_basement.strip()),
                "description": description.strip()
            }

        except ValueError as e:
            print("Error parsing prediction result:", e)
            return jsonify({"error": "Prediction result could not be parsed correctly. Ensure the model outputs the expected format."}), 500

        return jsonify({"prediction": response})

    except Exception as e:
        print("Error during prediction:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


