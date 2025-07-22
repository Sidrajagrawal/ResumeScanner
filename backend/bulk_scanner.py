# bulk_scanner.py
from flask import Blueprint, request, jsonify
from extractor import extract_resume_features
from jd_matcher import match_resumes_to_jd

bulk_bp = Blueprint("bulk", __name__)

@bulk_bp.route("/bulk-scan", methods=["POST"])
def bulk_scan():
    files = request.files.getlist("resumes")
    if not files:
        return jsonify({"error": "No resumes uploaded"}), 400

    all_results = []
    for file in files:
        filename = file.filename
        features = extract_resume_features(file, filename)
        if features:
            all_results.append({
                "filename": filename,
                "summary": f"Skills: {', '.join(features.get('skills', []))}, Category: {features.get('category')}",
                "category": features.get("category"),
                "skills": features.get("skills"),
            })

    return jsonify({
        "top_resumes": all_results[:10]  # limit to top 10
    })
