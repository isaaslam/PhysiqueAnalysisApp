import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { auth } from '../src/firebase/firebase';
import LottieView from 'lottie-react-native';
import loadingAnim from '../assets/loading.json';
import { Card, IconButton, List } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Buffer } from 'buffer';


export default function ResultsScreen() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUrl = params.imageUrl as string | undefined;

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // const userId = auth.currentUser?.uid;
        // if (!userId) throw new Error('User not logged in');

        // // const res = await fetch(`http://192.168.68.51:5050/analyse?userId=${userId}`);
        // let apiUrl = `http://192.168.68.51:5050/analyse?userId=${userId}`;
        // if (imageUrl) {
        //     apiUrl += `&imageUrl=${encodeURIComponent(imageUrl)}`;
        // }
        let apiUrl = '';

        // if (imageUrl) {
        //     // If we came from myphotos and clicked an image
        //     apiUrl = `http://192.168.68.51:5050/analyse?imageUrl=${encodeURIComponent(imageUrl)}`;
        // } else {
        //     // Otherwise use latest photo for the logged-in user
        //     const userId = auth.currentUser?.uid;
        //     if (!userId) throw new Error('User not logged in');
        //     apiUrl = `http://192.168.68.51:5050/analyse?userId=${userId}`;
        // }

        if (imageUrl) {
            // BASE64 ENCODE THE IMAGE URL
            let imageUrlBase64 = Buffer.from(imageUrl).toString('base64');
            imageUrlBase64 = imageUrlBase64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
            apiUrl = `http://192.168.68.51:5050/analyse?imageBase64=${encodeURIComponent(imageUrlBase64)}`;
        } else {
            // Otherwise use latest photo for the logged-in user
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not logged in');
            apiUrl = `http://192.168.68.51:5050/analyse?userId=${userId}`;
        }
        

        const res = await fetch(apiUrl);

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

        // --- Helper to generate advice dynamically ---
    const getAdvice = (metric: string, value: number | null) => {
        if (!value && value !== 0) return 'Data unavailable.';

        switch (metric) {
        case 'shoulder_to_waist_ratio':
            return value >= 2
            ? 'Excellent shoulder to waist ratio. Keep it up!'
            : 'Focus on reducing waist size and training lateral delts with shoulder presses and lateral raises.';

        case 'shoulder_height_diff':
            return value <= 0.005
            ? 'Ideal symmetry.'
            : 'Consider soft tissue work on traps, lats, and possibly address any spinal alignment issues.';

        case 'hip_height_diff':
            return value <= 0.005
            ? 'Ideal symmetry.'
            : 'Stretch and strengthen glutes, hip flexors, and lower back to correct hip asymmetry.';

        case 'leg_to_torso_ratio':
            return value >= 1.35 && value <= 1.55
            ? 'Excellent balance between torso and legs.'
            : value > 1.55
            ? 'Prioritise leg development to add size and balance.'
            : 'Consider enhancing upper body hypertrophy for better proportion.';

        case 'arm_length_symmetry':
            return value <= 0.005
            ? 'Excellent arm symmetry.'
            : 'Stretch and strengthen both biceps and triceps evenly.';

        case 'leg_length_symmetry':
            return value <= 0.005
            ? 'Excellent leg symmetry.'
            : 'Consider soft tissue work on glutes, hamstrings, and calves to address imbalances.';

        default:
            return '';
        }
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#000', padding: 20 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconButton
            icon="arrow-left"
            size={28}
            iconColor="white"
            onPress={() => router.replace('/home')}
            style={{ marginLeft: -8 }}
        />
        </View>


        <View style={{ alignItems: 'center', marginBottom: 40, marginTop: 5 }}>
            <Text style={{ 
                color: 'white', 
                fontSize: 32, 
                fontFamily: 'Inter_700Bold', 
                textAlign: 'center'
            }}>
                Analysis Results
            </Text>
            <View style={{ 
                height: 3, 
                width: 230, 
                backgroundColor: '#7B61FF', 
                marginTop: 6, 
                borderRadius: 2 
            }} />
        </View>


        {/* Summary Scores */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          <Card style={{ backgroundColor: '#121212', padding: 10, alignItems: 'center', width: 160 }}>
            <Text style={{ color: 'white', marginBottom: 18, fontSize: 16, fontFamily: 'Inter_600SemiBold', textAlign: 'center'}}>Proportion Score</Text>
            <AnimatedCircularProgress
              size={140}
              width={18}
              fill={result.summary_scores.proportion_score * 10}
              tintColor="#9D7CFF"
              backgroundColor="#333"
            >
              {() => (
                <Text style={{ color: '#7B61FF', fontSize: 22, fontFamily: 'Inter_700Bold' }}>
                  {result.summary_scores.proportion_score}/10
                </Text>
              )}
            </AnimatedCircularProgress>
          </Card>

          <Card style={{ backgroundColor: '#121212', padding: 10, alignItems: 'center', width:160 }}>
            <Text style={{  color: 'white', marginBottom: 18, fontSize: 16, fontFamily: 'Inter_600SemiBold', textAlign: 'center' }}>Symmetry Score</Text>
            <AnimatedCircularProgress
              size={140}
              width={18}
              fill={result.summary_scores.symmetry_score * 10}
              tintColor="#9D7CFF"
              backgroundColor="#333"
            >
              {() => (
                <Text style={{ color: '#7B61FF', fontSize: 22 , fontFamily: 'Inter_700Bold'}}>
                  {result.summary_scores.symmetry_score}/10
                </Text>
              )}
            </AnimatedCircularProgress>
          </Card>
        </View>


        {[
            { label: 'Shoulder Width', value: result.metrics.shoulder_width },
            { label: 'Waist Width', value: result.metrics.waist_width },
            { label: 'Left Arm Length', value: result.metrics.left_arm_length },
            { label: 'Right Arm Length', value: result.metrics.right_arm_length },
            { label: 'Left Leg Length', value: result.metrics.left_leg_length },
            { label: 'Right Leg Length', value: result.metrics.right_leg_length }
        ].map((item, index) => (
            <Card 
                key={index} 
                style={{ 
                    backgroundColor: '#121212', 
                    marginBottom: 8, 
                    padding: 10,
                    borderRadius: 8, 
                    marginHorizontal: 16 
                }}
            >
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Inter_600SemiBold', textAlign: 'center' }}>
                    {item.label}: {item.value.toFixed(3)}
                </Text>
            </Card>
        ))}



      {/* --- Metrics with recommendations (Accordions) --- */}
      <List.Section>
        <List.Accordion
            title={`Shoulder-to-Waist Ratio: ${result.metrics.shoulder_to_waist_ratio.toFixed(3)}`}
            titleStyle={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}
            style={{ backgroundColor: '#121212' }}
        >
            <Text style={{ color: 'white', padding: 10 }}>
            {getAdvice('shoulder_to_waist_ratio', result.metrics.shoulder_to_waist_ratio)}
            </Text>
        </List.Accordion>

        <List.Accordion
            title={`Shoulder Height Difference: ${result.metrics.shoulder_height_diff.toFixed(3)}`}
            titleStyle={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}
            style={{ backgroundColor: '#121212' }}
        >
            <Text style={{ color: 'white', padding: 10 }}>
            {getAdvice('shoulder_height_diff', result.metrics.shoulder_height_diff)}
            </Text>
        </List.Accordion>

        <List.Accordion
            title={`Hip Height Difference: ${result.metrics.hip_height_diff.toFixed(3)}`}
            titleStyle={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}
            style={{ backgroundColor: '#121212' }}
        >
            <Text style={{ color: 'white', padding: 10 }}>
            {getAdvice('hip_height_diff', result.metrics.hip_height_diff)}
            </Text>
        </List.Accordion>

        <List.Accordion
            title={`Leg-to-Torso Ratio: ${result.metrics.leg_to_torso_ratio.toFixed(3)}`}
            titleStyle={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}
            style={{ backgroundColor: '#121212' }}
        >
            <Text style={{ color: 'white', padding: 10 }}>
            {getAdvice('leg_to_torso_ratio', result.metrics.leg_to_torso_ratio)}
            </Text>
        </List.Accordion>

        <List.Accordion
            title={`Arm Length Symmetry: ${result.metrics.arm_length_symmetry.toFixed(3)}`}
            titleStyle={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}
            style={{ backgroundColor: '#121212' }}
        >
            <Text style={{ color: 'white', padding: 10 }}>
            {getAdvice('arm_length_symmetry', result.metrics.arm_length_symmetry)}
            </Text>
        </List.Accordion>

        <List.Accordion
            title={`Leg Length Symmetry: ${result.metrics.leg_length_symmetry.toFixed(3)}`}
            titleStyle={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}
            style={{ backgroundColor: '#121212' }}
        >
            <Text style={{ color: 'white', padding: 10 }}>
            {getAdvice('leg_length_symmetry', result.metrics.leg_length_symmetry)}
            </Text>
        </List.Accordion>
      </List.Section>



      </ScrollView>
    );
}
