export class MusicPlayer {
    constructor() {
        this.player = null;
        this.isPlaying = false;
        this.currentTrack = null;
        this.init();
    }

    init() {
        // Initialize YouTube API
        if (typeof YT === 'undefined') {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            this.player = new YT.Player('youtube-player', {
                height: '0',
                width: '0',
                playerVars: {
                    'playsinline': 1,
                    'controls': 0
                },
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this)
                }
            });
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const videoId = item.dataset.url.split('/').pop();
                const title = item.textContent.trim();
                this.playTrack(videoId, title);
            });
        });
    }

    playTrack(videoId, title) {
        if (this.player) {
            this.player.loadVideoById(videoId);
            this.player.playVideo();
            this.currentTrack = title;
            this.updateUI(title);
        }
    }

    updateUI(title) {
        const musicToggle = document.querySelector('.music-toggle');
        const nowPlaying = document.querySelector('.now-playing');
        
        musicToggle.classList.add('playing');
        if (nowPlaying) {
            nowPlaying.textContent = title;
            nowPlaying.classList.add('visible');
        }
    }

    onPlayerStateChange(event) {
        const musicToggle = document.querySelector('.music-toggle');
        
        if (event.data === YT.PlayerState.PLAYING) {
            musicToggle.classList.add('playing');
            this.isPlaying = true;
        } else {
            musicToggle.classList.remove('playing');
            this.isPlaying = false;
        }
    }

    togglePlayer() {
        const playlist = document.querySelector('.music-playlist');
        playlist.classList.toggle('visible');
    }
} 