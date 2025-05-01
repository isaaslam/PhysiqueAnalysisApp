// app/results.tsx

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { auth } from '../src/firebase/firebase';
import LottieView from 'lottie-react-native';
import loadingAnim from '../assets/loading.json';

export default function ResultsScreen() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not logged in');

        const res = await fetch(`http://192.168.68.51:5050/analyse?userId=${userId}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={loadingAnim}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' }}>
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Analysis Results</Text>
      <Text style={{ color: 'white', fontSize: 18 }}>Shoulder Width: {result.shoulder_width}</Text>
      <Text style={{ color: 'white', fontSize: 18 }}>Waist Width: {result.waist_width}</Text>
      <Text style={{ color: 'white', fontSize: 18 }}>
        Shoulder-to-Waist Ratio: {result.shoulder_to_waist_ratio}
      </Text>
    </View>
  );
}
