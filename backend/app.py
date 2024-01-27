from flask import Flask, request, jsonify
import io
import openai
from keys import OPENAI_API_KEY
import pdfplumber

app = Flask(__name__)
openai.api_key = OPENAI_API_KEY

@app.route('/')
def home():
    return "Welcome!"


@app.route('/read_pdf', methods=['POST'])
def read_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        pdf_text = ""
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                pdf_text += page_text

        return jsonify({"text": pdf_text})

@app.route('/query_openai', methods=['POST'])
def query_openai():
    data = request.json
    query = data.get('query', '')

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": query}],
            max_tokens=300
        )
        return jsonify(response.choices[0].message['content'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)