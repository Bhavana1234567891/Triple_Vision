from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from model import preprocess_image, analyze_regions, predict, get_detailed_analysis

app = Flask(__name__)
CORS(app)

print("Server initialized successfully!")

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # Save the uploaded file temporarily
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, 'temp_image.jpg')
        file.save(temp_path)
        
        try:
            # Analyze image regions
            regions = analyze_regions(temp_path)
            
            # Preprocess the image and get predictions
            features = preprocess_image(temp_path)
            prediction, confidence = predict(features)
            
            # Get detailed analysis
            analysis = get_detailed_analysis(prediction, confidence, regions)
            
            # Prepare response
            result_message = {
                'result': f"Analysis complete. Classification: {analysis['classification']} (Confidence: {analysis['confidence']:.1f}%)\n\n" +
                         f"Risk Level: {analysis['risk_level']}\n" +
                         f"Regions of Interest: {analysis['regions_of_interest']}\n\n" +
                         "Suspicious Areas:\n" +
                         f"- High: {analysis['suspicion_levels']['high']}\n" +
                         f"- Medium: {analysis['suspicion_levels']['medium']}\n" +
                         f"- Low: {analysis['suspicion_levels']['low']}\n\n" +
                         "Recommendations:\n" +
                         "\n".join([f"- {rec}" for rec in analysis['recommendations']]) +
                         "\n\nIMPORTANT: This is an AI-assisted analysis and should not be used as a definitive diagnosis. Please consult with a healthcare professional for proper medical evaluation.",
                'class': analysis['classification'],
                'confidence': analysis['confidence'],
                'risk_level': analysis['risk_level'],
                'regions': regions,
                'recommendations': analysis['recommendations']
            }
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
        return jsonify(result_message)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
