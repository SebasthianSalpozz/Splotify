import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { Artist } from '../models/artist';
import { uploadImageToCloudinary } from '../utils/cloudinaryConfig';
import { getUserRole } from './auth';

const artistsCollection = collection(db, 'artists');

export const createArtist = async (userId: string, name: string, genreId: string, image: File): Promise<Artist> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para crear artistas');

  const { url, publicId } = await uploadImageToCloudinary(image);
  const docRef = await addDoc(artistsCollection, {
    name,
    genreId,
    imageUrl: url,
    imagePublicId: publicId,
  });

  return { id: docRef.id, name, genreId, imageUrl: url, imagePublicId: publicId };
};

export const getArtistsByGenre = async (genreId: string): Promise<Artist[]> => {
  const q = query(artistsCollection, where('genreId', '==', genreId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Artist));
};

export const updateArtist = async (userId: string, artistId: string, name: string, genreId: string, image?: File): Promise<void> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para actualizar artistas');

  const artistDoc = doc(db, 'artists', artistId);
  const updateData: Partial<Artist> = { name, genreId };
  if (image) {
    const { url, publicId } = await uploadImageToCloudinary(image);
    updateData.imageUrl = url;
    updateData.imagePublicId = publicId;
  }
  await updateDoc(artistDoc, updateData);
};

export const deleteArtist = async (userId: string, artistId: string): Promise<void> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para eliminar artistas');

  const artistDoc = doc(db, 'artists', artistId);
  await deleteDoc(artistDoc);
};