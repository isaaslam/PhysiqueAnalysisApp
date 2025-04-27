import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase/firebase';

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/home'); // Go to Home after signup
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Signup failed.');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Sign Up</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        textColor='white'
        theme={{
          colors: {
            text: 'white',
            placeholder: 'white',
            primary: '#7B61FF',
            background: '#1C1C1C',
          },
        }}
        style={{ width: '80%', marginBottom: 20 }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        textColor='white'
        secureTextEntry
        theme={{
          colors: {
            text: 'white',
            placeholder: 'white',
            primary: '#7B61FF',
            background: '#1C1C1C',
          },
        }}
        style={{ width: '80%', marginBottom: 20 }}
      />

      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSignup}
        loading={loading}
        style={{ backgroundColor: '#7B61FF', marginTop: 10 }}
        labelStyle={{ color: 'white' }}
      >
        Sign Up
      </Button>

      <Link href="/login" style={{ marginTop: 20, color: 'white' }}>
        Already have an account? Login
      </Link>
    </View>
  );
}
