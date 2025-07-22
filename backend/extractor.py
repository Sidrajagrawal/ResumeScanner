import re
import spacy
import docx2txt
import PyPDF2

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Define skill keywords (extend as needed)
SKILL_DB = [
    "python", "java", "c++", "c", "sql", "react", "flask", "django", "tensorflow", "pytorch",
    "nlp", "machine learning", "deep learning", "data analysis", "pandas", "numpy", "scikit-learn",
    "html", "css", "javascript", "typescript", "git", "docker", "aws", "azure", "mongodb", "linux"
]

# ----------------------------- #
# Text Extraction Functions     #
# ----------------------------- #

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    return docx2txt.process(file)

# ----------------------------- #
# Individual Field Extractors   #
# ----------------------------- #

def extract_email(text):
    match = re.search(r"[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+", text)
    return match.group(0) if match else None

def extract_phone(text):
    match = re.search(r"\+?\d[\d\s\-()]{8,}\d", text)
    return match.group(0) if match else None

def extract_name(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text.strip()
    return None

def extract_education(text):
    edu_keywords = [
        "bachelor", "master", "b.sc", "m.sc", "b.tech", "m.tech", "phd", "mba", "bca", "mca", "msc", "be", "me"
    ]
    lines = text.lower().split('\n')
    matches = [line.strip() for line in lines if any(kw in line for kw in edu_keywords)]
    return ', '.join(set(matches)).title() if matches else None

def extract_experience(text):
    patterns = [
        r"(\d+)\+?\s+years", r"experience of\s+(\d+)\s+years", r"(\d+)\s+years of experience"
    ]
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return f"{match.group(1)} years"
    return None

def extract_skills(text):
    text_lower = text.lower()
    found = [skill for skill in SKILL_DB if skill in text_lower]
    return ', '.join(sorted(set(found))).title() if found else None

def extract_projects(text):
    project_lines = []
    capture = False
    for line in text.splitlines():
        if "project" in line.lower():
            capture = True
        if capture:
            project_lines.append(line.strip())
            if len(project_lines) > 5:
                break
    return ' '.join(project_lines).strip()[:300] if project_lines else None

def generate_summary(data):
    name = data.get("Name") or "The candidate"
    skills = data.get("Skills") or "various technical skills"
    experience = data.get("Experience") or "an unspecified amount of experience"
    education = data.get("Education") or "a relevant education background"
    return f"{name} is a professional with {experience}, skilled in {skills}, and holds {education}."

# ----------------------------- #
# Main Entry Function           #
# ----------------------------- #

def extract_resume_features(file, filename):
    # Extract text from file
    if filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file)
    elif filename.lower().endswith(".docx"):
        text = extract_text_from_docx(file)
    elif filename.lower().endswith(".txt"):
        text = file  # If plain text is passed directly
    else:
        raise ValueError("Unsupported file format")

    # Run all extractors
    data = {
        "Name": extract_name(text),
        "Email": extract_email(text),
        "Phone": extract_phone(text),
        "Education": extract_education(text),
        "Experience": extract_experience(text),
        "Skills": extract_skills(text),
        "Projects": extract_projects(text),
    }

    data["Summary"] = generate_summary(data)
    return data
