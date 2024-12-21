import React, { useState, useRef, useCallback } from 'react';
import YouTube from 'react-youtube';
import '../../styles/components/MusicPlayer.css';

const playlist = [
  {
    title: "Lofi Hip Hop",
    artist: "Lofi Girl",
    videoId: "jfKfPfyJRdk",
    cover: "https://img.icons8.com/fluency/48/musical-notes.png"
  },
  {
    title: "Coding Music",
    artist: "ChilledCow",
    videoId: "5qap5aO4i9A",
    cover: "https://img.icons8.com/fluency/48/musical-notes.png"
  },
  {
    title: "Deep Focus",
    artist: "Study Music",
    videoId: "DWcJFNfaw9c",
    cover: "https://img.icons8.com/fluency/48/musical-notes.png"
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0
    }
  };

  const onReady = useCallback((event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    setIsReady(true);
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (playerRef.current && isReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, isReady]);

  const changeTrack = useCallback((index) => {
    if (!isReady) return;
    setCurrentTrack(index);
    if (playerRef.current) {
      playerRef.current.loadVideoById(playlist[index].videoId);
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, isReady]);

  const playNext = useCallback(() => {
    const nextTrack = (currentTrack + 1) % playlist.length;
    changeTrack(nextTrack);
  }, [currentTrack, changeTrack]);

  const playPrev = useCallback(() => {
    const prevTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    changeTrack(prevTrack);
  }, [currentTrack, changeTrack]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(newVolume);
    }
  }, [isReady]);

  const onStateChange = useCallback((event) => {
    // YouTube player states
    switch (event.data) {
      case -1: // unstarted
        break;
      case 0: // ended
        playNext();
        break;
      case 1: // playing
        setIsPlaying(true);
        break;
      case 2: // paused
        setIsPlaying(false);
        break;
      default:
        break;
    }
  }, [playNext]);

  const onError = (error) => {
    console.error('YouTube Player Error:', error);
    playNext(); // Skip to next track if there's an error
  };

  return (
    <div className="music-player">
      <YouTube
        videoId={playlist[currentTrack].videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        className="youtube-player"
      />

      <button
        className={`music-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={() => setShowPlaylist(!showPlaylist)}
        title="Ambient Music"
      >
        <img
          src="https://img.icons8.com/fluency/48/music.png"
          alt="music"
          width="24"
          height="24"
        />
        {isPlaying && (
          <div className="music-wave">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        )}
      </button>

      <div className={`music-playlist ${showPlaylist ? 'visible' : ''}`}>
        <div className="playlist-header">
          <h3>
            <img
              src="https://img.icons8.com/fluency/48/musical-notes.png"
              alt="music"
              width="20"
              height="20"
            />
            Ambient Music
          </h3>
          <div className="volume-control">
            <img
              src="https://img.icons8.com/fluency/48/speaker.png"
              alt="volume"
              width="16"
              height="16"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>

        <div className="playlist-controls">
          <button onClick={playPrev} title="Previous">
            <img
              src="https://img.icons8.com/fluency/48/skip-to-start.png"
              alt="previous"
              width="24"
              height="24"
            />
          </button>
          <button onClick={togglePlay} className="play-btn" title={isPlaying ? 'Pause' : 'Play'}>
            <img
              src={`https://img.icons8.com/fluency/48/${isPlaying ? 'pause' : 'play'}.png`}
              alt={isPlaying ? 'pause' : 'play'}
              width="24"
              height="24"
            />
          </button>
          <button onClick={playNext} title="Next">
            <img
              src="https://img.icons8.com/fluency/48/end.png"
              alt="next"
              width="24"
              height="24"
            />
          </button>
        </div>

        <div className="playlist-items">
          {playlist.map((track, index) => (
            <div
              key={index}
              className={`playlist-item ${currentTrack === index ? 'active' : ''}`}
              onClick={() => changeTrack(index)}
            >
              <img src={track.cover} alt={track.title} width="24" />
              <div className="track-info">
                <span className="track-title">{track.title}</span>
                <span className="track-artist">{track.artist}</span>
              </div>
              {currentTrack === index && isPlaying && (
                <div className="playing-indicator">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="music-note">
          🎵 Ambient music to enhance your coding experience
        </p>
      </div>
    </div>
  );
}
