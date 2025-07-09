// src/components/SongList.tsx
import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import type { Song } from '../models/song';

interface SongListProps {
  songs: Song[];
  onPlay: (song: Song) => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, onPlay }) => {
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

  const handlePlay = (song: Song) => {
    setActiveSongId(song.id);
    onPlay(song);
  };

  return (
    <ListGroup variant="flush">
      {songs.map((song, index) => (
        <ListGroup.Item
          key={song.id}
          className={`song-list-item ${activeSongId === song.id ? 'active' : ''}`}
          action
          onClick={() => handlePlay(song)}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <span className="me-3">{index + 1}</span>
                <span>{song.name}</span>
            </div>
            <span>▶️</span>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};