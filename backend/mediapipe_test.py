import mediapipe as mp
import cv2

# Initialise MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

image = cv2.imread('test_image.jpg')  

if image is None:
    print("Error: Image not found.")
else:
    # Convert the BGR image to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Process the image and find pose landmarks
    results = pose.process(image_rgb)

    if results.pose_landmarks:
        print("Pose landmarks detected!")
    else:
        print("No pose landmarks detected.")
