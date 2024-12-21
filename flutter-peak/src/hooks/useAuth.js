import { useState, useCallback } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const useAuth = () => {
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const signIn = useCallback(async (email, password) => {
    const auth = getAuth();
    let lastError;

    for (let i = 0; i <= retryCount; i++) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setRetryCount(0);
        return result;
      } catch (error) {
        lastError = error;
        if (error.code !== 'auth/network-request-failed') {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }

    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
    }
    throw lastError;
  }, [retryCount]);

  return { signIn, retryCount };
};
