from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from extractor import extract_resume_features
import fitz  # PyMuPDF
from PyPDF2 import PdfReader
from io import BytesIO
from resume_advisor import resume_advisor_bp  # Blueprint for Resume Advisor
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import io
import re

# --------------------- Helper Functions ---------------------

def extract_text_from_pdf(file_storage):
    file_bytes = file_storage.read()
    reader = PdfReader(BytesIO(file_bytes))

    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text

def clean_text(text):
    """Basic text cleaning for prediction route"""
    text = re.sub(r'[^\w\s]', '', text)
    return text.lower().strip()

# --------------------- Flask App Setup ----------------------

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Register Resume Advisor Blueprint
app.register_blueprint(resume_advisor_bp, url_prefix="/api/resume_advisor")

# Load ML model and vectorizer
model = joblib.load("resume_classifier_model.joblib")
vectorizer = joblib.load("tfidf_vectorizer.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# --------------------- Routes -------------------------------

@app.route("/")
def home():
    return "✅ CVision Flask API is running!"

@app.route("/classify", methods=["POST"])
def classify_resume():
    try:
        resume_file = request.files.get("resume")
        jd_text = request.form.get("job_description")  # Use .get() to avoid KeyError

        # Extract resume text
        from PyPDF2 import PdfReader
        from io import BytesIO
        reader = PdfReader(BytesIO(resume_file.read()))
        resume_text = ""
        for page in reader.pages:
            resume_text += page.extract_text()

        # Load ML stuff
        tfidf = joblib.load("tfidf_vectorizer.pkl")
        model = joblib.load("resume_classifier_model.joblib")
        le = joblib.load("label_encoder.pkl")

        # Predict category
        X = tfidf.transform([resume_text])
        pred = model.predict(X)[0]
        category = le.inverse_transform([pred])[0]

        # If JD is provided, calculate similarity
        similarity_score = None
        if jd_text:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            vectorizer = TfidfVectorizer()
            vectors = vectorizer.fit_transform([jd_text, resume_text])
            similarity_score = cosine_similarity(vectors[0], vectors[1])[0][0]

        return jsonify({
            "category": category,
            "summary": resume_text[:300] + "...",
            "similarity": float(similarity_score) if similarity_score is not None else None
        })

    except Exception as e:
        print("🔥 Error in /classify route:", e)
        return jsonify({"error": str(e)}), 500



@app.route("/predict-category", methods=["POST"])
def predict_category():
    try:
        data = request.get_json()
        resume_text = data.get("resume", "")
        cleaned = clean_text(resume_text)
        vector = vectorizer.transform([cleaned])
        predicted_category = model.predict(vector)[0]
        return jsonify({"predicted_category": predicted_category})
    except Exception as e:
        print("🔥 Error in /predict-category route:", e)
        return jsonify({"error": "Failed to predict category", "details": str(e)}), 500


@app.route("/bulk-scan", methods=["POST"])
def bulk_scan():
    try:
        resumes = request.files.getlist("resumes")

        # Load models
        tfidf = joblib.load("tfidf_vectorizer.pkl")
        model = joblib.load("resume_classifier_model.joblib")
        le = joblib.load("label_encoder.pkl")

        results = []

        for resume_file in resumes:
            # Extract text
            text = extract_text_from_pdf(resume_file)

            # Predict category
            X = tfidf.transform([text])
            pred = model.predict(X)[0]
            category = le.inverse_transform([pred])[0]

            results.append({
                "filename": resume_file.filename,
                "match_percentage": 85,  # You can calculate real score later
                "summary": text[:250] + "...",
                "category": category
            })

        return jsonify({"top_resumes": results})

    except Exception as e:
        print("🔥 Error in /bulk-scan:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/course-impact-plot", methods=["POST"])
def course_impact_plot():
    try:
        resume_file = request.files.get("resume")
        if not resume_file:
            return jsonify({"error": "No resume uploaded"}), 400

        # Extract resume text
        text = extract_text_from_pdf(resume_file).lower()

        # Define keywords for each course (simple example)
        course_keywords = {
            'DSA': ['array', 'linked list', 'tree', 'graph', 'recursion', 'dynamic programming'],
            'Web Dev': ['html', 'css', 'javascript', 'react', 'node', 'express'],
            'Machine Learning': ['machine learning', 'regression', 'classification', 'scikit-learn', 'tensorflow'],
            'Cloud Computing': ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes'],
            'DBMS': ['sql', 'database', 'mysql', 'postgres', 'mongodb'],
            'Operating Systems': ['process', 'thread', 'memory', 'scheduling', 'deadlock'],
            'System Design': ['system design', 'scalability', 'microservices', 'api', 'architecture'],
        }

        impact_scores = {}

        # Score based on keyword presence
        for course, keywords in course_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            impact_scores[course] = score * 15  # simple scaling factor

        # Prepare DataFrame
        df = pd.DataFrame({
            "Course": list(impact_scores.keys()),
            "Impact Score": list(impact_scores.values())
        })

        # Plot
        plt.figure(figsize=(9, 5))
        sns.set(style="whitegrid")
        sns.barplot(x='Impact Score', y='Course', data=df, palette='coolwarm')
        plt.title("📊 Impact of Courses on Resume Score", fontsize=14)
        plt.xlabel("Impact Score")
        plt.ylabel("Course")
        plt.tight_layout()

        img_bytes = io.BytesIO()
        plt.savefig(img_bytes, format='png')
        img_bytes.seek(0)
        plt.close()

        return send_file(img_bytes, mimetype='image/png')

    except Exception as e:
        print("🔥 Error in course-impact-plot:", e)
        return jsonify({"error": str(e)}), 500

# --------------------- Run Server ---------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
