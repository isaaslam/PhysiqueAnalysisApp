// app/myphotos.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { auth, db } from '../src/firebase/firebase';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { IconButton } from 'react-native-paper';

export default function MyPhotosScreen() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPhotos = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const photosRef = collection(db, "users", userId, "photos");
      const q = query(photosRef, orderBy("uploadedAt", "desc"));
      const querySnapshot = await getDocs(q);

      const photoData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPhotos(photoData);
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Loading photos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000', padding: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor="white"
          onPress={() => router.replace('/home')}
          style={{ marginLeft: -8 }}
        />
      </View>

      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
        My Photos
      </Text>

      {photos.length === 0 && (
        <Text style={{ color: 'white', textAlign: 'center' }}>No photos found.</Text>
      )}

      {photos.map(photo => (
        <TouchableOpacity
          key={photo.id}
          onPress={() => router.push({ pathname: '/results', params: { imageUrl: photo.imageUrl } })}
          style={{
            marginBottom: 15,
            borderRadius: 8,
            overflow: 'hidden',
            borderColor: '#7B61FF',
            borderWidth: 1
          }}
        >
          <Image
            source={{ uri: photo.imageUrl }}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

