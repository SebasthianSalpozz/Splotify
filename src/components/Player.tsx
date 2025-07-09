// src/components/Player.tsx
import { useRef, useEffect } from 'react';
import type { Song } from '../models/song';

interface PlayerProps {
  currentSong: Song | null;
}

export const Player: React.FC<PlayerProps> = ({ currentSong }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.play().catch(err => console.error('Error al reproducir:', err));
    }
  }, [currentSong]);

  if (!currentSong) return null;

  return (
    <div className="player p-3 fixed-bottom">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="player-info">
            {/* Si en el futuro tu modelo 'Song' tiene imageUrl, se mostrará aquí */}
            {/* <img src={currentSong.imageUrl || '/default-album-art.png'} alt={currentSong.name} /> */}
            <div>
                <h5>{currentSong.name}</h5>
                {/* Podrías agregar el nombre del artista si lo tuvieras */}
                {/* <p>{currentSong.artistName}</p> */}
            </div>
        </div>
        <div className="flex-grow-1 mx-3">
            <audio ref={audioRef} controls className="w-100" />
        </div>
      </div>
    </div>
  );
};