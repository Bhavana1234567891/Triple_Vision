import numpy as np
import cv2
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Initialize a simple model
model = RandomForestClassifier(n_estimators=100, random_state=42)
scaler = StandardScaler()

def preprocess_image(image_path, target_size=(224, 224)):
    # Read image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read the image")
    
    # Convert BGR to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    lab[...,0] = clahe.apply(lab[...,0])
    img = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    
    # Resize
    img = cv2.resize(img, target_size)
    
    # Extract features (using simple statistics for demonstration)
    features = extract_features(img)
    
    return features

def extract_features(img):
    """Extract basic image features"""
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    
    # Calculate basic statistics
    mean = np.mean(gray)
    std = np.std(gray)
    median = np.median(gray)
    
    # Calculate histogram features
    hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
    hist_features = hist.flatten()[:10]  # Use first 10 histogram bins
    
    # Combine features
    features = np.concatenate([[mean, std, median], hist_features])
    
    return features.reshape(1, -1)

def analyze_regions(image_path):
    """Analyze different regions of the mammogram for suspicious areas"""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read the image")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Analyze regions
    regions = []
    for i, contour in enumerate(contours):
        area = cv2.contourArea(contour)
        if area > 100:  # Filter out very small regions
            x, y, w, h = cv2.boundingRect(contour)
            density = cv2.mean(gray[y:y+h, x:x+w])[0]
            
            regions.append({
                'id': i + 1,
                'location': {'x': x, 'y': y, 'width': w, 'height': h},
                'area': area,
                'density': density,
                'suspicion_level': 'high' if density < 100 else 'medium' if density < 150 else 'low'
            })
    
    return regions

def predict(features):
    """Make prediction using the model"""
    # For demonstration, we'll use a simple rule-based approach
    # In a real application, you would use a properly trained model
    mean_intensity = features[0][0]  # Using the mean intensity as a simple feature
    
    if mean_intensity < 100:
        prediction = 'Malignant'
        confidence = 0.8
    else:
        prediction = 'Benign'
        confidence = 0.7
    
    return prediction, confidence

def get_detailed_analysis(prediction, confidence, regions):
    """Generate a detailed analysis report"""
    # Count regions by suspicion level
    suspicion_counts = {'high': 0, 'medium': 0, 'low': 0}
    for region in regions:
        suspicion_counts[region['suspicion_level']] += 1
    
    analysis = {
        'classification': prediction,
        'confidence': confidence * 100,  # Convert to percentage
        'regions_of_interest': len(regions),
        'suspicion_levels': suspicion_counts,
        'risk_level': 'High' if confidence > 0.75 and prediction == 'Malignant' else 
                     'Medium' if confidence > 0.5 and prediction == 'Malignant' else 'Low',
        'recommendations': []
    }
    
    # Add recommendations based on analysis
    if analysis['risk_level'] == 'High':
        analysis['recommendations'].extend([
            'Immediate consultation with a healthcare provider is strongly recommended',
            'Additional diagnostic imaging may be necessary',
            'Consider scheduling a biopsy for definitive diagnosis'
        ])
    elif analysis['risk_level'] == 'Medium':
        analysis['recommendations'].extend([
            'Follow-up with a healthcare provider is recommended',
            'Consider additional screening in 3-6 months',
            'Monitor for any changes or new symptoms'
        ])
    else:
        analysis['recommendations'].extend([
            'Continue routine screening as recommended by your healthcare provider',
            'Maintain regular self-examinations',
            'Report any changes to your healthcare provider'
        ])
    
    return analysis
