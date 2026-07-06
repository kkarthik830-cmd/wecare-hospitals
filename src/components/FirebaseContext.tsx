import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
}

interface FirebaseContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const registrationInProgress = useRef<boolean>(false);

  // Synchronize Auth and user profile doc
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (registrationInProgress.current) {
        console.log("FirebaseContext: registrationInProgress is active, ignoring state transition for user:", currentUser?.uid);
        return;
      }
      
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // Profile does not exist yet (e.g., if social login bypassed registration)
            const profileData: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Valued Patient',
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, profileData);
            setUserProfile(profileData);
          }
        } catch (err) {
          console.error("Failed to load user profile doc:", err);
          // Set a fallback local profile so app remains operational
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Valued Patient',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      
      // Ensure the profile document is written
      const userDocRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        const profileData = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Valued Patient',
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, profileData);
      }
      return currentUser;
    } catch (err) {
      console.error("Google sign in failure:", err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    registrationInProgress.current = true;
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = result.user;
      
      // Set the standard displayName
      await updateProfile(currentUser, { displayName });
      
      // Write profile to firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        uid: currentUser.uid,
        email: email,
        displayName: displayName,
        createdAt: serverTimestamp(),
      });
      
      // Sign out from standard auto-signin session immediately
      await signOut(auth);
      
      return currentUser;
    } catch (err) {
      console.error("Sign up failure:", err);
      throw err;
    } finally {
      // Allow auth state updates to process normally again
      registrationInProgress.current = false;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      console.error("Sign in failure:", err);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Log out failure:", err);
      throw err;
    }
  };

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      signInWithGoogle, 
      signUpWithEmail, 
      signInWithEmail, 
      logOut 
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
