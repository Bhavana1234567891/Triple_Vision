Early Stage Detection of Breast Cancer Using deep learning

Overview

This project leverages deep learning and generative AI for early-stage breast cancer detection using mammogram images. The system integrates a hybrid model combining InceptionV3, ResNet50, and DenseNet121, along with explainability tools and a generative AI-powered chatbot for enhanced patient engagement and diagnostic support.

Features

Hybrid Deep Learning Model: Uses InceptionV3, ResNet50, and DenseNet121 for improved classification accuracy.
Preprocessing Pipeline: Enhances mammogram images using resizing, normalization, and heatmap-based visualization.
Explainable AI (XAI): Integrates LIME (Local Interpretable Model-Agnostic Explanations) for model transparency.
Generative AI Chatbot: Provides patient-friendly explanations and customized diagnostic reports.
Automated Report Generation: Uses Gen AI for personalized diagnostic summaries.
REST API Backend: Built with Flask for handling ML model inference and chatbot interactions.
Interactive Frontend: Developed using React.js with Vite and styled with TailwindCSS.

Tech Stack

Frontend: React.js, Vite, TailwindCSS
Backend: Flask, Python
Machine Learning: TensorFlow, Keras, OpenCV
Database: SQLite (for storing patient reports)
Deployment: Docker, AWS/GCP (optional)
