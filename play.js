import { songs } from "./songs.js";

const MIN_YEAR = 2023;
const MAX_YEAR = 2024;
const DEFAULT_TIMESTAMP = 30;
const SONG_DURATION = 25;

const params = new URLSearchParams(window.location.search);

const playButton = document.querySelector('#play');
const solutionButton = document.querySelector('#reveal');
const solution = document.querySelector('#solution');
const year = document.querySelector('#year');
const country = document.querySelector("#country");
const title = document.querySelector("#title");
const artist = document.querySelector("#artist");
const place = document.querySelector("#place");
const video = document.querySelector('#video');

playButton.addEventListener('click', () => {
    solution.style.visibility = "hidden";
    toggleButtons();
    playSong();
});
solutionButton.addEventListener('click', () => {
    toggleButtons();
    revealSong();
});

function playSong() {
    let index;
    if (params.has("play")) {
        index = Number(params.get("play")?.replace(/\D/g, ""));
        params.delete("play");
    } else {
        do {
            index = randomIntFromInterval(0, songs.length - 1);
            song = songs[index];
        } while (song.year < MIN_YEAR || song.year > MAX_YEAR);
    }
    const song = songs[index];
    video.dataset.id = song.id;
    video.dataset.start = song.timestamp ?? DEFAULT_TIMESTAMP;
    video.dataset.end = (song.timestamp ?? DEFAULT_TIMESTAMP) + SONG_DURATION;
    year.textContent = song.year;
    country.textContent = song.country;
    title.textContent = song.title;
    artist.textContent = song.artist;
    place.textContent = song.place;
    initYouTubeVideos();
    video.firstChild.click(); // Force autoplay.
}

function revealSong() {
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
