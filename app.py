from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load the trained model and vectorizer
model = joblib.load('spam_detector_model.joblib')
vectorizer = joblib.load('vectorizer.joblib')

@app.route('/predict', methods=['GET','POST'])
def predict():
    try:
        data = request.get_json(force=True)
        message = data['message']
        
        # Transform the message using the loaded vectorizer
        message_vec = vectorizer.transform([message])
        
        # Predict using the loaded model
        prediction = model.predict(message_vec)[0]
        
        # Return the prediction as a JSON response
        return jsonify({'isSpam': bool(prediction)})

    except Exception as e:
        # Log the exception for debugging
        print(f"Error classifying message: {str(e)}")
        # Return an error response
        return jsonify({'error': 'Error classifying message'}), 500

if __name__ == '__main__':
    app.run(debug=True)