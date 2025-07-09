import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    displayName,
    role: 'user',
  });
  return user;
};

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      role: 'user',
    });
  }
  return user;
};

export const logout = async () => {
  await signOut(auth);
};

export const createDefaultAdmin = async () => {
  const adminUID = 'C9s59cLiAWOkoGBpq8qqMbtfApS2';
  const adminDoc = await getDoc(doc(db, 'users', adminUID));
  if (!adminDoc.exists()) {
    await setDoc(doc(db, 'users', adminUID), {
      email: 'admin@splotify.com',
      displayName: 'Admin',
      role: 'admin',
    });
    console.log('Documento del administrador creado');
  }
};

export const getUserRole = async (uid: string): Promise<string> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data().role : 'user';
};