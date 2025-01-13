import { songs } from "./songs.js";

const DEFAULT_TIMESTAMP = 30;
const SONG_EXCERPT_DURATION = 25;


let currentSongIndex;
let currentSongTimeout;
const params = new URLSearchParams(window.location.search);

const video = document.querySelector('#video');
const solution = document.querySelector('#solution');
const playButton = document.querySelector('#play');
const solutionButton = document.querySelector('#reveal');
playButton.addEventListener('click', () => startSong());
solutionButton.addEventListener('click', () => revealSong());

function startSong() {
    if (params.has("play")) {
        currentSongIndex = Number(params.get("play").replace(/\D/g, ""));
        params.delete("play");
    } else {
        currentSongIndex = randomIntFromInterval(0, songs.length - 1);
    }
    const song = songs[currentSongIndex];
    const src = `https://www.youtube.com/embed/${song.id}?autoplay=1&start=${song.timestamp ?? DEFAULT_TIMESTAMP}`;
    video.src = src;
    clearTimeout(currentSongTimeout);
    currentSongTimeout = setTimeout(stopSong, SONG_EXCERPT_DURATION * 1000);

    // Update interface.
    playButton.disabled = true;
    solutionButton.disabled = false;
    solution.innerText = "";
}

function stopSong() {
    video.src = "";
}

function revealSong() {
    solution.innerText = JSON.stringify(songs[currentSongIndex]);
    playButton.disabled = false;
}

/**
 * Generates a random integer from interval [min, max].
 *
 * Source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
 *
 * @param {int} min
 * @param {int} max
 * @returns A random integer from interval [min, max].
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
