# from flask import Flask, jsonify, request
# import firebase_admin
# from firebase_admin import credentials, firestore
# import datetime
# from utils import analyse_image 

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
#             image_url = data.get("imageUrl")

#             if not image_url:
#                 return jsonify({"error": "No imageUrl found"}), 404

#             analysis_result = analyse_image(image_url)

#             return jsonify(analysis_result)

#         return jsonify({"error": "No photos found for user"}), 404

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5050, debug=True)

from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore
import datetime
from utils import analyse_image 
import base64

app = Flask(__name__)

# Minimal, clean, correct
cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/analyse')
def analyse():
    user_id = request.args.get('userId')
    # image_url_param = request.args.get('imageUrl')

    # if not user_id:
    #     return jsonify({'error': 'Missing userId parameter'}), 400
    image_url_base64 = request.args.get('imageBase64')

    try:
        # === New logic: If imageUrl is passed, use it directly ===
        # if image_url_param:
        #     image_url = image_url_param
        if image_url_base64:
        # Decode the base64 image URL (if passed from results.tsx)
            image_url_base64 = image_url_base64.replace('-', '+').replace('_', '/')
            padding = 4 - len(image_url_base64) % 4
            if padding and padding != 4:
                image_url_base64 += '=' * padding
            image_url = base64.b64decode(image_url_base64).decode('utf-8')

        else:
            # === Fallback to latest photo (your existing logic) ===
            if not user_id:
                return jsonify({'error': 'Missing userId parameter'}), 400

            photos_ref = db.collection("users").document(user_id).collection("photos")
            query = photos_ref.order_by("uploadedAt", direction=firestore.Query.DESCENDING).limit(1)
            results = query.stream()

            image_url = None
            for doc in results:
                data = doc.to_dict()
                image_url = data.get("imageUrl")
                break  # Only expect one photo due to limit(1)

            if not image_url:
                return jsonify({"error": "No photos found for user"}), 404

        # === Run analysis as usual ===
        analysis_result = analyse_image(image_url)
        return jsonify(analysis_result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
