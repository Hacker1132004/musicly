alert("Welcome to Musicly");

// Array of songs dynamically filled with data from Spotify
let songs = [];
let audioElement = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

// Spotify Client ID and Client Secret
const clientId = 'c8d7db3837604b489b702345dc333213';
const clientSecret = '2772922386c34205946d66f0df1de76b';

// Function to get Spotify access token
const getAccessToken = async () => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) throw new Error('Failed to fetch access token');

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
};

// Function to search for artists
const searchArtists = async (artistName) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch artists');

        const data = await response.json();
        return data.artists.items.length > 0 ? data.artists.items : null;
    } catch (error) {
        console.error('Error searching for artists:', error);
    }
};

// Function to display the list of artists
const displayArtists = (artists) => {
    const artistListDiv = document.getElementById('artist-list');
    artistListDiv.innerHTML = ''; // Clear existing artists

    artists.forEach((artist) => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'artist';
        artistDiv.textContent = artist.name;
        artistDiv.onclick = () => getTopTracksByArtist(artist.id); // Load songs when clicked
        artistListDiv.appendChild(artistDiv);
    });
};

// Function to get top tracks by artist
const getTopTracksByArtist = async (artistId) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch top tracks');

        const data = await response.json();
        songs = data.tracks.map(track => ({
            songName: track.name,
            filePath: track.preview_url || 'default-preview-url.mp3',
            coverPath: track.album.images[0]?.url || 'default-cover.jpg'
        }));

        if (songs.length > 0) {
            playSong(songs[0].filePath);
            displaySongs();
        } else {
            alert('No tracks available for this artist');
        }
    } catch (error) {
        console.error('Error fetching top tracks:', error);
    }
};

// Function to display the list of songs
const displaySongs = () => {
    const songListDiv = document.getElementById('song-list');
    songListDiv.innerHTML = ''; // Clear existing songs

    songs.forEach((song, index) => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.textContent = song.songName;
        songDiv.onclick = () => {
            currentSongIndex = index;
            playSong(song.filePath);
        };
        songListDiv.appendChild(songDiv);
    });
};

// Function to play a song
const playSong = (songUrl) => {
    if (audioElement.src !== songUrl) {
        audioElement.src = songUrl;
        audioElement.load(); // Ensure the file is loaded
    }
    audioElement.play()
        .then(() => {
            isPlaying = true;
            updatePlayPauseButton('Pause');
        })
        .catch(error => {
            console.error('Error playing song:', error);
        });
};

// Function to pause the currently playing song
const pauseSong = () => {
    audioElement.pause();
    isPlaying = false;
    updatePlayPauseButton('Play');
};

// Update play/pause button text
const updatePlayPauseButton = (text) => {
    document.getElementById('play-pause').textContent = text;
};

// Play the next song
const playNextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(songs[currentSongIndex].filePath);
};

// Play the previous song
const playPreviousSong = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(songs[currentSongIndex].filePath);
};

// Handle play/pause button click
document.getElementById('play-pause').addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong(songs[currentSongIndex].filePath);
});

// Handle next button click
document.getElementById('next').addEventListener('click', playNextSong);

// Handle previous button click
document.getElementById('prev').addEventListener('click', playPreviousSong);

// Update minimize and maximize button with function
document.getElementById('minimize-maximize').addEventListener('click', () => {
    const player = document.getElementById('player');
    const button = document.getElementById('minimize-maximize');

    if (player.classList.contains('minimized')) {
        player.classList.remove('minimized');
        button.textContent = 'Minimize';
    } else {
        player.classList.add('minimized');
        button.textContent = 'Maximize';
    }
});

// Update progress bar as the song plays
audioElement.addEventListener('timeupdate', () => {
    if (audioElement.duration) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        document.querySelector('#progress-bar input').style.width = `${progress}%`;
    }
});

// Handle progress bar click to seek within the song
document.getElementById('progress-bar').addEventListener('click', (event) => {
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newTime = (offsetX / rect.width) * audioElement.duration;
    audioElement.currentTime = newTime;
});

// Handle song end to play the next song
audioElement.addEventListener('ended', playNextSong);

// Function to handle artist search input
const handleArtistSearch = async () => {
    const searchInput = document.getElementById('search').value.trim();
    if (searchInput) {
        const artists = await searchArtists(searchInput);
        if (artists) {
            displayArtists(artists);
        } else {
            alert('No artists found');
        }
    }
};

// Attach artist search function to search button or input field
document.getElementById('search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleArtistSearch();
});

document.getElementById('search-button').addEventListener('click', handleArtistSearch);

// Initialize by searching for artists from Spotify
document.addEventListener('DOMContentLoaded', () => {
    const artistName = prompt("Enter artist name to load songs from Spotify:");
    if (artistName) handleArtistSearch(artistName);
});

const defaultArtists = [
    { name: 'Arijit Singh', image: 'arijit.png' },
    { name: 'Swaroop Khan', image: 'Swaroop_khan.png' },
    { name: 'Dhanda Nyoliwala', image: 'Dhanda.png' },
    { name: 'Kam Lohgarh', image: 'Kam_Lohgarh.png' },
    { name: 'Yo Yo Honey Singh', image: 'Honey.png' },
    { name: 'Karan Aujla', image: 'Karan.png' },
];

// Function to sanitize artist names for HTML IDs
const formatArtistId = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// Function to render artists in the HTML
const renderArtists = (artists) => {
    const artistProfileDiv = document.getElementById('artist-profile');
    artistProfileDiv.innerHTML = ''; // Clear any existing content

    artists.forEach(artist => {
        // Create artist container
        const artistDiv = document.createElement('div');
        artistDiv.className = 'artist';
        artistDiv.id = `artist-${formatArtistId(artist.name)}`;
        artistDiv.onclick = () => getSongsByArtist(artist.name); // Set onclick function

        // Create artist image
        const artistImg = document.createElement('img');
        artistImg.src = artist.image || artist.images[0]?.url || 'default-artist.png'; // Fallback image if not provided
        artistImg.alt = `${artist.name} Cover Image`;

        // Create artist name element
        const artistName = document.createElement('h2');
        artistName.className = 'name';
        artistName.textContent = artist.name;

        // Append image and name to artist container
        artistDiv.appendChild(artistImg);
        artistDiv.appendChild(artistName);

        // Append artist container to the main artist profile div
        artistProfileDiv.appendChild(artistDiv);
    });
};

// Initialize and load artists
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch additional top artists from Spotify
    const topArtists = await fetchTopArtists();
    
    // Combine default artists with fetched artists
    const combinedArtists = [...defaultArtists, ...(topArtists || [])];

    // Render combined list of artists
    renderArtists(combinedArtists);
});

// Function to fetch top artists dynamically
const fetchTopArtists = async (query = 'genre:punjabi') => { // Use genres or keywords for broader search
    try {
        const token = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch artists');

        const data = await response.json();
        return data.artists.items; // Return array of artist objects
    } catch (error) {
        console.error('Error fetching artists:', error);
    }
};

// Initialize and load artists
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch additional top artists using broader criteria
    const topArtists = await fetchTopArtists('genre:punjabi'); // Fetch top artists in the pop genre

    // Combine default artists with fetched artists
    const combinedArtists = [...defaultArtists, ...(topArtists || [])];

    // Render combined list of artists
    renderArtists(combinedArtists);
});
const getSongsByArtist = async (artistName) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(artistName)}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch songs for artist');

        const data = await response.json();
        const tracks = data.tracks.items.map(track => ({
            songName: track.name,
            filePath: track.preview_url || 'default-preview-url.mp3',
            coverPath: track.album.images[0]?.url || 'default-cover.jpg'
        }));

        // Update global songs array and display
        songs = tracks;
        if (songs.length > 0) {
            playSong(songs[0].filePath);
            displaySongs();
        } else {
            alert('No songs found for this artist');
        }
    } catch (error) {
        console.error('Error fetching songs by artist:', error);
    }
};

