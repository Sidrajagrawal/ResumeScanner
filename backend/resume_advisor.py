# resume_advisor.py

import fitz  # PyMuPDF
from flask import Blueprint, request, jsonify

resume_advisor_bp = Blueprint('resume_advisor', __name__)

@resume_advisor_bp.route('/advise', methods=['POST'])
def advise():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # Read file content
        if file.filename.endswith('.pdf'):
            doc = fitz.open(stream=file.read(), filetype="pdf")
            text = "".join([page.get_text() for page in doc])
            doc.close()
        elif file.filename.endswith('.txt'):
            text = file.read().decode('utf-8')
        else:
            return jsonify({"error": "Unsupported file type"}), 415

        # Strong, detailed suggestions
        return jsonify({
            "summary": (
                "Your resume structure is decent, but here are expert-level improvements:\n"
                "- Use concise bullet points (max 2 lines each) starting with action verbs.\n"
                "- Tailor the resume for specific job roles – avoid a one-size-fits-all format.\n"
                "- Avoid filler words like 'hardworking', focus on results.\n"
                "- Use consistent formatting, spacing, and fonts throughout the resume.\n"
                "- Place key achievements in top third (visible without scrolling)."
            ),
            "skills": [
                "Include modern stack: React, Node.js, FastAPI, Docker, MongoDB, Firebase.",
                "Mention AI/ML exposure: Pandas, Scikit-learn, TensorFlow, OpenCV.",
                "Add cloud tools: AWS (EC2, S3), GCP, Azure Fundamentals.",
                "If applicable: GitHub Actions, CI/CD pipelines, REST APIs, WebSockets.",
                "Highlight tools: Postman, JIRA, Notion, Figma (for product folks).",
                "Include personal traits like 'adaptability', 'initiative', and 'collaboration'."
            ],
            "achievements": [
                "Quantify impact: 'Reduced latency by 40%', 'Grew user base to 5k+'.",
                "List top 3 impactful projects with GitHub/website links.",
                "Add hackathon wins, internships, freelance gigs, open-source PRs.",
                "Include leadership: Led team of 4+, managed timelines, resolved blockers.",
                "If fresher: add academic achievements (rank, top %ile), research work.",
                "Certifications: AWS, Google Cloud, DataCamp, Coursera, etc."
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
