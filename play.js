import { songs } from "./songs.js";

const MIN_YEAR = 2024;
const MAX_YEAR = 2024;
const DEFAULT_TIMESTAMP = 30;
const SONG_EXCERPT_DURATION = 25;

const params = new URLSearchParams(window.location.search);
let currentSongIndex = Number(params.get("play")?.replace(/\D/g, ""));
let currentSongTimeout;

const playButton = document.querySelector('#play');
const solutionButton = document.querySelector('#reveal');
const solution = document.querySelector('#solution');
const embed = document.querySelector('#embed');
const year = document.querySelector('#year');
const country = document.querySelector("#country");
const title = document.querySelector("#title");
const artist = document.querySelector("#artist");
const place = document.querySelector("#place");
const video = document.querySelector('#video');

playButton.addEventListener('click', () => {
    startSong();
    toggleButtons();
    solution.style.visibility = "hidden";
});
solutionButton.addEventListener('click', () => {
    revealSong();
    toggleButtons();
});

function startSong() {
    let song;
    if (params.has("play")) {
        params.delete("play");
        song = songs[currentSongIndex];
    } else {
        do {
            currentSongIndex = randomIntFromInterval(0, songs.length - 1);
            song = songs[currentSongIndex];
        } while (song.year < MIN_YEAR || song.year > MAX_YEAR);
    }
    const src = `https://www.youtube.com/embed/${song.id}?autoplay=1&start=${song.timestamp ?? DEFAULT_TIMESTAMP}`;
    video.src = src;
    clearTimeout(currentSongTimeout);
    currentSongTimeout = setTimeout(stopSong, SONG_EXCERPT_DURATION * 1000);
}

function stopSong() {
    video.src = "";
}

function revealSong() {
    const song = songs[currentSongIndex];
    embed.src = `https://www.youtube.com/embed/${song.id}`;
    year.textContent = song.year;
    country.textContent = song.country;
    title.textContent = song.title;
    artist.textContent = song.artist;
    place.textContent = song.place;
    solution.style.visibility = "visible";
}

function toggleButtons() {
    solutionButton.classList.toggle("disabled");
    playButton.classList.toggle("disabled");
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
