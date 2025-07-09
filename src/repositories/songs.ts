import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { Song } from '../models/song';
import { uploadAudioToCloudinary } from '../utils/cloudinaryConfig';
import { getUserRole } from './auth';

const songsCollection = collection(db, 'songs');

export const createSong = async (userId: string, name: string, artistId: string, audio: File): Promise<Song> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para crear canciones');

  const { url, publicId } = await uploadAudioToCloudinary(audio);
  const docRef = await addDoc(songsCollection, {
    name,
    artistId,
    audioUrl: url,
    audioPublicId: publicId,
  });

  return { id: docRef.id, name, artistId, audioUrl: url, audioPublicId: publicId };
};

export const getSongsByArtist = async (artistId: string): Promise<Song[]> => {
  const q = query(songsCollection, where('artistId', '==', artistId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Song));
};

export const updateSong = async (userId: string, songId: string, name: string, artistId: string, audio?: File): Promise<void> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para actualizar canciones');

  const songDoc = doc(db, 'songs', songId);
  const updateData: Partial<Song> = { name, artistId };
  if (audio) {
    const { url, publicId } = await uploadAudioToCloudinary(audio);
    updateData.audioUrl = url;
    updateData.audioPublicId = publicId;
  }
  await updateDoc(songDoc, updateData);
};

export const deleteSong = async (userId: string, songId: string): Promise<void> => {
  const role = await getUserRole(userId);
  if (role !== 'admin') throw new Error('No tienes permisos para eliminar canciones');

  const songDoc = doc(db, 'songs', songId);
  await deleteDoc(songDoc);
};