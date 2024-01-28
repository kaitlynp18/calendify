from flask import Flask, jsonify, request, session
from flask_session import Session
import json
import openai
from keys import OPENAI_API_KEY
import pdfplumber

app = Flask(__name__)
openai.api_key = OPENAI_API_KEY

app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route('/')
def home():
    session.clear()
    return "Welcome!"

@app.route('/read_pdf', methods=['POST'])
def read_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    uploaded_files = request.files.getlist('file')
    session_text = session.get('pdf_text', '')

    for file in uploaded_files:
        if file.filename == '':
            continue
        with pdfplumber.open(file) as pdf:
            session_text += "\n--- Start of File ---\n"
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    session_text += page_text + "\n"
            session_text += "--- End of File ---\n"
    
    session['pdf_text'] = session_text
    return jsonify({"message": "PDFs processed successfully"}), 200

@app.route('/query_openai', methods=['POST'])
def query_openai():
    intro_text = ("Given the following course syllabi, write an ICS file with all the key dates and details related to classes, "
                  "office hours, exams, and assignment due dates spanning from the classes_start date to the classes_end date, "
                  "excluding any dates during the break inclusively. If any information is missing, leave the corresponding field "
                  "blank. Only output the properly formatted ICS file and do not truncate it at all. Here is an example output: "
                  "'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n\nBEGIN:VEVENT\nSUMMARY:MATH 458 Lecture\n"
                  "DTSTART;TZID=America/New_York:20240104T160500\nDTEND;TZID=America/New_York:20240104T172500\n"
                  "RRULE:FREQ=WEEKLY;UNTIL=20240412T235959Z;BYDAY=TU,TH;WKST=SU\nEXDATE;TZID=America/New_York:20240305T160500,20240307T160500\n"
                  "LOCATION:BH 1104\nEND:VEVENT\n\nBEGIN:VEVENT\nSUMMARY:MATH 458 Office Hours\nDTSTART;TZID=America/New_York:20240104T130000\n"
                  "DTEND;TZID=America/New_York:20240104T140000\nRRULE:FREQ=WEEKLY;UNTIL=20240412T235959Z;BYDAY=TH;WKST=SU\n"
                  "EXDATE;TZID=America/New_York:20240307T130000\nLOCATION:BH 924\nEND:VEVENT\n\nBEGIN:VEVENT\nSUMMARY:MATH 458 Assignment 1\n"
                  "DTSTART;VALUE=DATE:20240202\nDTEND;VALUE=DATE:20240203\nDESCRIPTION:Worth 5% of the final mark\nEND:VEVENT\n\nBEGIN:VEVENT\n"
                  "SUMMARY:MATH 458 Midterm Exam\nDTSTART;TZID=America/New_York:20240313T180000\nDTEND;TZID=America/New_York:20240313T200000\n"
                  "DESCRIPTION:Worth 30% of the final mark\nLOCATION:TBA\nEND:VEVENT\n\nEND:VCALENDAR'")

    # load term dates
    with open('config.json') as config_file:
        term_dates = json.load(config_file)
    term_info = f"\nTerm Information:\nFall 2023: {term_dates['fall2023']}\nWinter 2024: {term_dates['winter2024']}\n"
    
    # load pdf text
    pdf_text = session.get('pdf_text', '')
    if not pdf_text:
        return jsonify({"error": "No PDF text available"}), 400
    
    query = intro_text + term_info + pdf_text

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": query}]
        )
        return jsonify(response.choices[0].message['content'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/clear_session', methods=['POST'])
def clear_session():
    session.pop('pdf_text', None)
    return jsonify({"message": "Session cleared successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)