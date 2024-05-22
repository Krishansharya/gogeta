import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import BernoulliNB
import joblib

# Load dataset (replace 'spam.csv' with the path to your dataset)
data = pd.read_csv('spam.csv', encoding='latin-1')

# Preprocess dataset
data = data[['v1', 'v2']]  # Keeping only necessary columns
data.columns = ['label', 'message']
data['label'] = data['label'].map({'ham': 0, 'spam': 1})

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(data['message'], data['label'], test_size=0.2, random_state=42)

# Vectorize text data
vectorizer = CountVectorizer()
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train logistic regression model
bnb = BernoulliNB()
model = LogisticRegression()
model.fit(X_train_vec, y_train)
bnb.fit(X_train_vec,y_train)


# Save the model and vectorizer
joblib.dump(model, 'spam_detector_model.joblib')
joblib.dump(vectorizer, 'vectorizer.joblib')
