import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { Genre } from '../models/genre';
import { getUserRole } from './auth';
import { uploadImageToCloudinary } from '../utils/cloudinaryConfig';

const genresCollection = collection(db, 'genres');

export const createGenre = async (userId: string, name: string, image: File): Promise<Genre> => {
  try {
    const role = await getUserRole(userId);
    if (role !== 'admin') throw new Error('No tienes permisos para crear géneros');
    const { url, publicId } = await uploadImageToCloudinary(image);
    console.log('Datos a enviar:', { name, imageUrl: url, imagePublicId: publicId });
    const docRef = await addDoc(genresCollection, { name, imageUrl: url, imagePublicId: publicId });
    return { id: docRef.id, name, imageUrl: url, imagePublicId: publicId };
  } catch (error) {
    console.error('Error en createGenre:', error);
    throw error;
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const querySnapshot = await getDocs(genresCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Genre));
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    throw error;
  }
};

export const updateGenre = async (userId: string, genreId: string, name: string, image?: File): Promise<void> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para actualizar géneros');

  const genreDoc = doc(db, 'genres', genreId);
  const updateData: Partial<Genre> = { name };
  if (image) {
    const { url, publicId } = await uploadImageToCloudinary(image);
    updateData.imageUrl = url;
    updateData.imagePublicId = publicId;
  }
  await updateDoc(genreDoc, updateData);
};

export const deleteGenre = async (userId: string, genreId: string): Promise<void> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para eliminar géneros');

  const genreDoc = doc(db, 'genres', genreId);
  await deleteDoc(genreDoc);
};