const MIN_YEAR = 2024;
const MAX_YEAR = 2024;

const ENDPOINT = "https://eurovisionworld.com/eurovision/";

const iframe = document.createElement("iframe");
// iframe.style.display = 'none';
document.body.append(iframe);
document.querySelector('#play').addEventListener('click', play);

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function play() {
    // Fetch voting table for a random year.
    const year = randomIntFromInterval(MIN_YEAR, MAX_YEAR);
    const parsingVotingTable = new Promise(resolve => {
        const handler = () => {
            iframe.removeEventListener("load", handler);
            resolve(parseVotingTable(iframe.contentWindow.document));
        };
        iframe.addEventListener("load", handler);
    });
    const votingTable = await parsingVotingTable;
    iframe.src = ENDPOINT + year;

    // Choose a random country from that year.
    const index = randomIntFromInterval(0, votingTable.length - 1);
    const [place, country, songURL] = votingTable[index];
    const parsingSongData = new Promise(resolve => {
        const handler = async () => {
            iframe.removeEventListener("load", handler);
            resolve(parseSongData(iframe.contentWindow.document));
        };
        iframe.addEventListener("load", handler);
    });
    iframe.src = songURL;
    const [artist, title, id] = await parsingSongData;
    const embed = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${id}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    document.querySelector('#video').innerHTML = embed;
}


async function scrap() {
    for (let year = MAX_YEAR; year >= MIN_YEAR; year--) {
        // Parse results for the year.
        const parsingVotingTable = new Promise(resolve => {
            const handler = () => {
                iframe.removeEventListener("load", handler);
                resolve(parseVotingTable(iframe.contentWindow.document));
            };
            iframe.addEventListener("load", handler);
        });
        iframe.src = ENDPOINT + year;
        const votingTable = await parsingVotingTable;

        // Parse data for each song of the year.
        const yearData = [];
        for (const [place, country, location] of votingTable) {
            const parsingSongData = new Promise(resolve => {
                const handler = async () => {
                    iframe.removeEventListener("load", handler);
                    resolve(parseSongData(iframe.contentWindow.document));
                };
                iframe.addEventListener("load", handler);
            });
            iframe.src = location;
            const [artist, title, video] = await parsingSongData;
            const link = `https://www.ravbug.com/yt-audio/?v=${video}`;
            const qrcode = new QRCode("test", {
                text: link,
                width: 128,
                height: 128,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            yearData.push([year, country, title, artist, place, video, link]);

            // Wait between subsequent calls to avoid too many requests.
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // TODO: Output as csv.
        console.log(yearData);
    }
}

function parseVotingTable(document) {
    const output = [];
    const table = document.querySelector("#voting_table tbody");
    for (const row of table.querySelectorAll("tr")) {
        const cells = Array.from(row.querySelectorAll("td"));
        const place = +cells.shift().textContent;
        const country = cells.shift().textContent;
        const location = cells.shift().querySelector("a").href;
        output.push([place, country, location]);
    }
    return output;
}

function parseSongData(document) {
    const song = document.querySelector("[itemtype$=MusicRecording]");
    const artist = song.querySelector("[itemprop=byArtist]").textContent;
    const title = song.querySelector("[itemprop=name]").textContent;
    const video = song.querySelector("[data-video-youtube]").dataset.videoIframe;
    return [artist, title, video];
}
