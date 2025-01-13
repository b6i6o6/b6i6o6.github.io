async function scrap(year) {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    // Parse results for the year.
    const parsingVotingTable = new Promise(resolve => {
        const handler = () => {
            iframe.removeEventListener("load", handler);
            resolve(parseVotingTable(iframe.contentWindow.document));
        };
        iframe.addEventListener("load", handler);
    });
    iframe.src = `https://eurovisionworld.com/eurovision/${year}`;
    const votingTable = await parsingVotingTable;

    // Parse data for each song of the year.
    const yearData = [];
    for (const { place, country, url } of votingTable) {
        const parsingSongData = new Promise(resolve => {
            const handler = async () => {
                iframe.removeEventListener("load", handler);
                resolve(parseSongData(iframe.contentWindow.document));
            };
            iframe.addEventListener("load", handler);
        });
        iframe.src = url;
        const { artist, title, id } = await parsingSongData;
        yearData.push({ year, country, title, artist, place, id });
        console.log(yearData.at(-1));

        // Wait between subsequent calls to avoid too many requests.
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log(yearData.reverse());
}

function parseVotingTable(document) {
    return [...document.querySelectorAll("#voting_table tbody")].map(table => {
        const qualified = !table.closest('.v_table_out');
        return [...table.querySelectorAll("tr")].map(row => {
            const cells = Array.from(row.querySelectorAll("td"));
            const place = Number(cells.shift().textContent);
            const country = cells.shift().textContent;
            const url = cells.shift().querySelector("a").href;
            return {
                place: Number.isNaN(place) ? 'DQ' : qualified ? place : 'NQ',
                country,
                url
            };
        });
    }).flat();
}

function parseSongData(document) {
    const song = document.querySelector("[itemtype$=MusicRecording]");
    const artist = song.querySelector("[itemprop=byArtist]").textContent;
    const title = song.querySelector("[itemprop=name]").textContent;
    const id = song.querySelector("[data-video-youtube]").dataset.videoYoutube;
    return { artist, title, id };
}
