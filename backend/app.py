# from flask import Flask, jsonify, request
# import firebase_admin
# from firebase_admin import credentials, firestore
# import datetime

# app = Flask(__name__)

# # Minimal, clean, correct
# cred = credentials.Certificate("firebase-service-account.json")
# firebase_admin.initialize_app(cred)

# db = firestore.client()

# @app.route('/analyse')
# def analyse():
#     user_id = request.args.get('userId')
#     if not user_id:
#         return jsonify({'error': 'Missing userId parameter'}), 400

#     try:
#         photos_ref = db.collection("users").document(user_id).collection("photos")
#         query = photos_ref.order_by("uploadedAt", direction=firestore.Query.DESCENDING).limit(1)
#         results = query.stream()

#         for doc in results:
#             data = doc.to_dict()
#             return jsonify({
#                 "latestImageUrl": data.get("imageUrl"),
#                 "uploadedAt": data.get("uploadedAt").isoformat() if isinstance(data.get("uploadedAt"), datetime.datetime) else data.get("uploadedAt")
#             })

#         return jsonify({"error": "No photos found for user"}), 404

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

# backend/app.py

from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
import datetime
from utils import analyse_image 

app = Flask(__name__)

# Minimal, clean, correct
cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/analyse')
def analyse():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'Missing userId parameter'}), 400

    try:
        photos_ref = db.collection("users").document(user_id).collection("photos")
        query = photos_ref.order_by("uploadedAt", direction=firestore.Query.DESCENDING).limit(1)
        results = query.stream()

        for doc in results:
            data = doc.to_dict()
            image_url = data.get("imageUrl")

            if not image_url:
                return jsonify({"error": "No imageUrl found"}), 404

            analysis_result = analyse_image(image_url)

            return jsonify(analysis_result)

        return jsonify({"error": "No photos found for user"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
