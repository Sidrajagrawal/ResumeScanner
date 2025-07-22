# train_model.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset

df = pd.read_csv(r"C:\Users\Dell\Downloads\archive (1)\UpdatedResumeDataSet.csv") # ← 
# Preprocess
df['Resume'] = df['Resume'].apply(lambda x: x.lower())
X = df['Resume']
y = df['Category']

# Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# TF-IDF
tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
X_tfidf = tfidf.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y_encoded, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Save model and encoder
joblib.dump(model, "resume_classifier_model.joblib")
joblib.dump(tfidf, "tfidf_vectorizer.pkl")
joblib.dump(le, "label_encoder.pkl")













