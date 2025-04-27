// app/home.tsx
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, storage, db } from '../src/firebase/firebase';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, addDoc, serverTimestamp } from 'firebase/firestore'; // added doc here

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  const uploadImage = async (pickerResult: ImagePicker.ImagePickerResult) => {
    try {
      if (!pickerResult.canceled && pickerResult.assets.length > 0) {
        const asset = pickerResult.assets[0];
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not logged in');

        const timestamp = Date.now();
        const storageRef = ref(storage, `users/${userId}/${timestamp}.jpg`);

        // Upload image to Firebase Storage
        await uploadBytes(storageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Save image info to Firestore, nested inside user's document
        const userDocRef = doc(db, "users", userId);
        const photosCollectionRef = collection(userDocRef, "photos");

        await addDoc(photosCollectionRef, {
          imageUrl: downloadURL,
          uploadedAt: serverTimestamp(),
        });

        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Upload failed.');
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      uploadImage(pickerResult);
    } else {
      alert('Camera permission is required!');
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
      uploadImage(pickerResult);
    } else {
      alert('Gallery permission is required!');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 30 }}>Home</Text>

      <Button
        mode="contained"
        onPress={takePhoto}
        style={{ backgroundColor: '#7B61FF', marginBottom: 20 }}
        labelStyle={{ color: 'white' }}
      >
        Take a Photo
      </Button>

      <Button
        mode="contained"
        onPress={pickFromGallery}
        style={{ backgroundColor: '#7B61FF', marginBottom: 20 }}
        labelStyle={{ color: 'white' }}
      >
        Upload from Gallery
      </Button>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={{ backgroundColor: 'red', marginTop: 40 }}
        labelStyle={{ color: 'white' }}
      >
        Logout
      </Button>
    </View>
  );
}
