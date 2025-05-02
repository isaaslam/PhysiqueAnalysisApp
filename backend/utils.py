# import cv2
# import mediapipe as mp
# import numpy as np
# import urllib.request

# # Initialise MediaPipe Pose
# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose(static_image_mode=True)

# def download_image(url):
#     """Downloads an image from a URL and returns it as a numpy array."""
#     resp = urllib.request.urlopen(url)
#     image = np.asarray(bytearray(resp.read()), dtype="uint8")
#     image = cv2.imdecode(image, cv2.IMREAD_COLOR)
#     return image

# def calculate_distance(point1, point2):
#     """Calculates Euclidean distance between two 2D points."""
#     return np.linalg.norm(np.array([point1.x, point1.y]) - np.array([point2.x, point2.y]))

# def analyse_image(image_url):
#     """Given an image URL, downloads it, detects pose, and returns detailed measurements."""
#     image = download_image(image_url)

#     if image is None:
#         return {"error": "Failed to download image"}

#     # Convert to RGB (MediaPipe expects RGB)
#     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

#     # Run pose estimation
#     results = pose.process(image_rgb)

#     if not results.pose_landmarks:
#         return {"error": "No pose landmarks detected"}

#     landmarks = results.pose_landmarks.landmark

#     # --- Widths ---
#     shoulder_width = calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
#         landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
#     )
#     waist_width = calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_HIP],
#         landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
#     )
#     hip_width = calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_HIP],
#         landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
#     )

#     # --- Arm lengths (shoulder -> elbow -> wrist) ---
#     left_arm_length = (calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
#         landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
#     ) + calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_ELBOW],
#         landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
#     ))
#     right_arm_length = (calculate_distance(
#         landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER],
#         landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
#     ) + calculate_distance(
#         landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW],
#         landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
#     ))

#     # --- Leg lengths (hip -> knee -> ankle) ---
#     left_leg_length = (calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_HIP],
#         landmarks[mp_pose.PoseLandmark.LEFT_KNEE]
#     ) + calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_KNEE],
#         landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
#     ))
#     right_leg_length = (calculate_distance(
#         landmarks[mp_pose.PoseLandmark.RIGHT_HIP],
#         landmarks[mp_pose.PoseLandmark.RIGHT_KNEE]
#     ) + calculate_distance(
#         landmarks[mp_pose.PoseLandmark.RIGHT_KNEE],
#         landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
#     ))

#     # --- Heights for symmetry ---
#     shoulder_height_diff = abs(
#         landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y -
#         landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y
#     )
#     hip_height_diff = abs(
#         landmarks[mp_pose.PoseLandmark.LEFT_HIP].y -
#         landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y
#     )

#     # --- Ratios ---
#     shoulder_to_waist_ratio = shoulder_width / waist_width if waist_width != 0 else None
#     waist_to_hip_ratio = waist_width / hip_width if hip_width != 0 else None
#     torso_length = calculate_distance(
#         landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
#         landmarks[mp_pose.PoseLandmark.LEFT_HIP]
#     )
#     leg_to_torso_ratio = (left_leg_length + right_leg_length) / (2 * torso_length) if torso_length != 0 else None

#     # --- Symmetry values ---
#     arm_length_symmetry = abs(left_arm_length - right_arm_length)
#     leg_length_symmetry = abs(left_leg_length - right_leg_length)

#     return {
#         "shoulder_width": shoulder_width,
#         "waist_width": waist_width,
#         "hip_width": hip_width,
#         "shoulder_to_waist_ratio": shoulder_to_waist_ratio,
#         "waist_to_hip_ratio": waist_to_hip_ratio,
#         "left_arm_length": left_arm_length,
#         "right_arm_length": right_arm_length,
#         "left_leg_length": left_leg_length,
#         "right_leg_length": right_leg_length,
#         "shoulder_height_diff": shoulder_height_diff,
#         "hip_height_diff": hip_height_diff,
#         "leg_to_torso_ratio": leg_to_torso_ratio,
#         "arm_length_symmetry": arm_length_symmetry,
#         "leg_length_symmetry": leg_length_symmetry
#     }

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

def calculate_distance(point1, point2):
    """Calculates Euclidean distance between two 2D points."""
    return np.linalg.norm(np.array([point1.x, point1.y]) - np.array([point2.x, point2.y]))

def analyse_image(image_url):
    """Downloads an image, detects pose, calculates measurements, and computes proportion/symmetry scores."""
    image = download_image(image_url)
    if image is None:
        return {"error": "Failed to download image"}

    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)

    if not results.pose_landmarks:
        return {"error": "No pose landmarks detected"}

    landmarks = results.pose_landmarks.landmark

    # --- Widths ---
    shoulder_width = calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
        landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
    )
    waist_width = calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_HIP],
        landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
    )
    hip_width = calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_HIP],
        landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
    )

    # --- Arm lengths ---
    left_arm_length = calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
        landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
    ) + calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_ELBOW],
        landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
    )
    right_arm_length = calculate_distance(
        landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER],
        landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
    ) + calculate_distance(
        landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW],
        landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
    )

    # --- Leg lengths ---
    left_leg_length = calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_HIP],
        landmarks[mp_pose.PoseLandmark.LEFT_KNEE]
    ) + calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_KNEE],
        landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
    )
    right_leg_length = calculate_distance(
        landmarks[mp_pose.PoseLandmark.RIGHT_HIP],
        landmarks[mp_pose.PoseLandmark.RIGHT_KNEE]
    ) + calculate_distance(
        landmarks[mp_pose.PoseLandmark.RIGHT_KNEE],
        landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
    )

    # --- Heights (Y-axis) ---
    shoulder_height_diff = abs(
        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y -
        landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y
    )
    hip_height_diff = abs(
        landmarks[mp_pose.PoseLandmark.LEFT_HIP].y -
        landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y
    )

    # --- Ratios ---
    shoulder_to_waist_ratio = shoulder_width / waist_width if waist_width != 0 else None
    waist_to_hip_ratio = waist_width / hip_width if hip_width != 0 else None
    torso_length = calculate_distance(
        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
        landmarks[mp_pose.PoseLandmark.LEFT_HIP]
    )
    leg_to_torso_ratio = (left_leg_length + right_leg_length) / (2 * torso_length) if torso_length != 0 else None

    # --- Symmetry ---
    arm_length_symmetry = abs(left_arm_length - right_arm_length)
    leg_length_symmetry = abs(left_leg_length - right_leg_length)

    # === SCORING ===

    # Proportion Scoring --------------------------------

    # Shoulder-to-waist ratio scoring (higher = better, cap at 2.5)
    ideal_shoulder_to_waist = 2.0  # Aim high but realistic
    shoulder_score = min((shoulder_to_waist_ratio / ideal_shoulder_to_waist) * 10, 10) if shoulder_to_waist_ratio else 0

    # Waist-to-hip ratio scoring (lower is better, ideal ~0.85)
    ideal_waist_to_hip = 0.85
    if waist_to_hip_ratio:
        waist_score = max(0, min(10, (1 - abs(waist_to_hip_ratio - ideal_waist_to_hip) / 0.3) * 10))
    else:
        waist_score = 0

    # Leg-to-torso ratio scoring (ideal around 1.45)
    ideal_leg_to_torso = 1.45
    if leg_to_torso_ratio:
        leg_score = max(0, min(10, (1 - abs(leg_to_torso_ratio - ideal_leg_to_torso) / 0.5) * 10))
    else:
        leg_score = 0

    proportion_score = round((shoulder_score * 0.5 + waist_score * 0.25 + leg_score * 0.25), 2)

    # Symmetry Scoring ----------------------------------

    # Lower differences = better (scale to 10)
    shoulder_symmetry = max(0, 10 - (shoulder_height_diff * 100))
    hip_symmetry = max(0, 10 - (hip_height_diff * 100))
    arm_symmetry = max(0, 10 - (arm_length_symmetry * 100))
    leg_symmetry = max(0, 10 - (leg_length_symmetry * 100))

    symmetry_score = round(np.mean([shoulder_symmetry, hip_symmetry, arm_symmetry, leg_symmetry]), 2)

    # Final output --------------------------------------

    return {
        "summary_scores": {
            "proportion_score": proportion_score,
            "symmetry_score": symmetry_score
        },
        "metrics": {
            "shoulder_width": shoulder_width,
            "waist_width": waist_width,
            "hip_width": hip_width,
            "shoulder_to_waist_ratio": shoulder_to_waist_ratio,
            "waist_to_hip_ratio": waist_to_hip_ratio,
            "left_arm_length": left_arm_length,
            "right_arm_length": right_arm_length,
            "left_leg_length": left_leg_length,
            "right_leg_length": right_leg_length,
            "shoulder_height_diff": shoulder_height_diff,
            "hip_height_diff": hip_height_diff,
            "leg_to_torso_ratio": leg_to_torso_ratio,
            "arm_length_symmetry": arm_length_symmetry,
            "leg_length_symmetry": leg_length_symmetry
        }
    }
