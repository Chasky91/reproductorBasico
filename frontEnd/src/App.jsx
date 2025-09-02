import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import axios from 'axios';

// Componente para mostrar información de la canción actual
const SongInfo = ({ song }) => {
  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h3 style={{ margin: '0 0 5px 0' }}>{song.title}</h3>
      <p style={{ margin: '0', color: '#666' }}>{song.artist}</p>
    </div>
  );
};

// Componente de los controles principales
const PlayControls = ({ isPlaying, onPlay, onPause, onPrevious, onNext }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px' }}>
      <button onClick={onPrevious} style={{ padding: '10px', border: '1px solid #ccc', background: 'white' }}>
        <SkipBack size={20} />
      </button>
      
      <button 
        onClick={isPlaying ? onPause : onPlay} 
        style={{ padding: '10px', border: '1px solid #ccc', background: 'white' }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      
      <button onClick={onNext} style={{ padding: '10px', border: '1px solid #ccc', background: 'white' }}>
        <SkipForward size={20} />
      </button>
    </div>
  );
};

// Componente de la barra de progreso
const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px' }}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          style={{ flex: 1, height: '5px' }}
        />
        <span style={{ fontSize: '12px' }}>{formatTime(duration || 0)}</span>
      </div>
    </div>
  );
};

// Componente de control de volumen
const VolumeControl = ({ volume, onVolumeChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px' }}>
      <Volume2 size={16} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        style={{ width: '100px' }}
      />
    </div>
  );
};

// Componente de la lista de canciones
const PlayList = ({ songs, currentSongIndex, onSongSelect }) => {
  return (
    <div style={{ borderTop: '1px solid #ccc', maxHeight: '200px', overflow: 'auto' }}>
      <h4 style={{ padding: '10px', margin: '0', borderBottom: '1px solid #eee' }}>Playlist</h4>
      {songs.map((song, index) => (
        <div
          key={index}
          onClick={() => onSongSelect(index)}
          style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
            backgroundColor: index === currentSongIndex ? '#f0f0f0' : 'white'
          }}
        >
          <div style={{ fontWeight: index === currentSongIndex ? 'bold' : 'normal' }}>
            {song.title}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>{song.artist}</div>
        </div>
      ))}
    </div>
  );
};

// Componente principal del reproductor
const App = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
const [songs, setSongs] = useState([]);



  const [currentSong, setCurrentSong] = useState(0)


  // Simular reproducción (ya que no tenemos archivos de audio reales)
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/musicas')
    .then(response => {
      setSongs(response.data);
      setCurrentSong(response.data[0]);
    })
    .catch(error => {
      console.log(error);
    });
    console.log(songs);
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 180) { // 3 minutos simulados por canción
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSongIndex]);

  // Establecer duración simulada
  useEffect(() => {
    setDuration(180); // 3 minutos por canción
    setCurrentTime(0);
  }, [currentSongIndex]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
  };

  const handleNext = () => {
    const newIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div style={{ 
      width: '400px', 
      margin: '20px auto', 
      border: '1px solid #ccc', 
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Audio element (hidden, no real src) */}
      <audio ref={audioRef} />
      
      {/* Información de la canción */}
      <SongInfo song={currentSong} />
      
      {/* Barra de progreso */}
      <ProgressBar 
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />
      
      {/* Controles de reproducción */}
      <PlayControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      
      {/* Control de volumen */}
      <VolumeControl
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
      
      {/* Lista de reproducción */}
      <PlayList
        songs={songs}
        currentSongIndex={currentSongIndex}
        onSongSelect={handleSongSelect}
      />
    </div>
  );
};

export default App;