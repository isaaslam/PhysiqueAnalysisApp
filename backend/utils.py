# backend/utils.py

import cv2
import mediapipe as mp
import numpy as np
import urllib.request

# Initialise MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

def download_image(url):
    """Downloads an image from a URL and returns it as a numpy array."""
    resp = urllib.request.urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

def analyse_image(image_url):
    """Given an image URL, downloads it, detects pose, and returns basic measurements."""
    image = download_image(image_url)

    if image is None:
        return {"error": "Failed to download image"}

    # Convert to RGB (MediaPipe expects RGB)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Run pose estimation
    results = pose.process(image_rgb)

    if not results.pose_landmarks:
        return {"error": "No pose landmarks detected"}

    # Extract important landmarks
    landmarks = results.pose_landmarks.landmark

    # Define indices for shoulders and hips (from MediaPipe documentation)
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

    # Calculate Euclidean distances
    shoulder_width = np.linalg.norm(
        np.array([left_shoulder.x, left_shoulder.y]) - np.array([right_shoulder.x, right_shoulder.y])
    )
    waist_width = np.linalg.norm(
        np.array([left_hip.x, left_hip.y]) - np.array([right_hip.x, right_hip.y])
    )

    # Return basic measurements
    return {
        "shoulder_width": shoulder_width,
        "waist_width": waist_width,
        "shoulder_to_waist_ratio": shoulder_width / waist_width if waist_width != 0 else None,
    }
