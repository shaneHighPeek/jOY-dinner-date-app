import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';

export const useUser = () => {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Don't start Firestore listener until auth is resolved
    if (authLoading) {
      return;
    }

    // No user = no data to fetch
    if (!user) {
      setLoading(false);
      setUserData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('useUser: Firestore listener timed out after 10s');
        setLoading(false);
        setError('Connection timed out');
      }
    }, 10000);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      unsubscribeRef.current = onSnapshot(
        userDocRef,
        (doc) => {
          clearTimeout(timeoutId);
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          clearTimeout(timeoutId);
          console.error('useUser: Firestore error:', err);
          setLoading(false);
          setError(err.message);
        }
      );
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('useUser: Failed to set up listener:', err);
      setLoading(false);
      setError('Failed to connect');
    }

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user, authLoading]);

  return { userData, loading, error };
};
