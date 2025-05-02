// // app/results.tsx

// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView } from 'react-native';
// import { auth } from '../src/firebase/firebase';
// import LottieView from 'lottie-react-native';
// import loadingAnim from '../assets/loading.json';

// export default function ResultsScreen() {
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAnalysis = async () => {
//       try {
//         const userId = auth.currentUser?.uid;
//         if (!userId) throw new Error('User not logged in');

//         const res = await fetch(`http://192.168.68.51:5050/analyse?userId=${userId}`);
//         const data = await res.json();

//         if (data.error) throw new Error(data.error);

//         setResult(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalysis();
//   }, []);

//     if (loading) {
//       return (
//         <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
//           <LottieView
//             source={loadingAnim}
//             autoPlay
//             loop
//             style={{ width: 200, height: 200 }}
//           />
//         </View>
//       );
//     }

//     if (error) {
//       return (
//         <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
//           <Text style={{ color: 'red' }}>Error: {error}</Text>
//         </View>
//       );
//     }

//     return (
//       <ScrollView style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>
//         <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Analysis Results</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Shoulder Width: {result.shoulder_width}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Waist Width: {result.waist_width}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Hip Width: {result.hip_width}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Shoulder-to-Waist Ratio: {result.shoulder_to_waist_ratio}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Waist-to-Hip Ratio: {result.waist_to_hip_ratio}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Left Arm Length: {result.left_arm_length}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Right Arm Length: {result.right_arm_length}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Left Leg Length: {result.left_leg_length}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Right Leg Length: {result.right_leg_length}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Shoulder Height Difference: {result.shoulder_height_diff}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Hip Height Difference: {result.hip_height_diff}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Leg-to-Torso Ratio: {result.leg_to_torso_ratio}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Arm Length Symmetry: {result.arm_length_symmetry}</Text>
//         <Text style={{ color: 'white', fontSize: 18 }}>Leg Length Symmetry: {result.leg_length_symmetry}</Text>
//       </ScrollView>
//     );
// }

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
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
      <ScrollView style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 10 }}>Analysis Results</Text>

        {/* Summary Scores */}
        <Text style={{ color: '#7B61FF', fontSize: 20, marginBottom: 10 }}>
          Proportion Score: {result.summary_scores.proportion_score}/10
        </Text>
        <Text style={{ color: '#7B61FF', fontSize: 20, marginBottom: 20 }}>
          Symmetry Score: {result.summary_scores.symmetry_score}/10
        </Text>

        {/* Detailed Metrics */}
        <Text style={{ color: 'white', fontSize: 18 }}>Shoulder Width: {result.metrics.shoulder_width}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Waist Width: {result.metrics.waist_width}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Hip Width: {result.metrics.hip_width}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Shoulder-to-Waist Ratio: {result.metrics.shoulder_to_waist_ratio}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Waist-to-Hip Ratio: {result.metrics.waist_to_hip_ratio}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Left Arm Length: {result.metrics.left_arm_length}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Right Arm Length: {result.metrics.right_arm_length}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Left Leg Length: {result.metrics.left_leg_length}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Right Leg Length: {result.metrics.right_leg_length}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Shoulder Height Difference: {result.metrics.shoulder_height_diff}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Hip Height Difference: {result.metrics.hip_height_diff}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Leg-to-Torso Ratio: {result.metrics.leg_to_torso_ratio}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Arm Length Symmetry: {result.metrics.arm_length_symmetry}</Text>
        <Text style={{ color: 'white', fontSize: 18 }}>Leg Length Symmetry: {result.metrics.leg_length_symmetry}</Text>
      </ScrollView>
    );
}
