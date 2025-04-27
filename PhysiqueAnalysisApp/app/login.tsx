import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../src/firebase/firebase';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home'); // Go to Home screen
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Login failed.');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 20 }}>Login</Text>

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
        onPress={handleLogin}
        loading={loading}
        style={{ backgroundColor: '#7B61FF', marginTop: 10 }}
        labelStyle={{ color: 'white' }}
      >
        Login
      </Button>

      <Link href="/signup" style={{ marginTop: 20, color: 'white' }}>
        Don't have an account? Sign up
      </Link>
    </View>
  );
}
