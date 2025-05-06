import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/firebase/firebase';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/home'); // Go to Home if logged in
      } else {
        router.replace('/login'); // Go to Login if not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // No UI here, we immediately redirect
}
