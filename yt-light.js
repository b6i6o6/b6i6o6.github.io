/*
 * Light YouTube Embeds by @labnol
 * Credit: https://www.labnol.org/
 * Title from YT oauth by @kmhelander
 *
 * Edited to add support for start, end, and reusing the same div.
 */

function labnolIframe(div) {
  var iframe = document.createElement('iframe');
  var src = 'https://www.youtube-nocookie.com/embed/' + div.dataset.id + '?autoplay=1&rel=0';  // No Cookie URL...
  if (div.dataset.start) {
    src += '&start=' + div.dataset.start;
  }
  if (div.dataset.end) {
    src += '&end=' + div.dataset.end;
  }
  iframe.setAttribute('src', src);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '1');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
  );
  div.parentNode.replaceChild(iframe, div);
}

function initYouTubeVideos() {
  var playerElements = document.getElementsByClassName('youtube-player');
  for (var n = 0; n < playerElements.length; n++) {
    playerElements[n].replaceChildren();

    var videoId = playerElements[n].dataset.id;

    let ytDataUrl = 'https://www.youtube-nocookie.com/oembed?format=json&url=http%3A//youtube.com/watch%3Fv%3D' + videoId;

    // fetch() is async, each player on page must have unique ID
    let thisPlayerId = "playerid-" + n.toString();

    // Fetch the JSON from Youtube and write the video title in TextNode element
    fetch(ytDataUrl)
    .then(res => res.json())
    .then(out =>
    document.getElementById(thisPlayerId).innerHTML = out.title.substr(0,40))
    .catch(err => { console.log(err) });

    // get the poster image in a IMG element
    var div = document.createElement('div');
    div.setAttribute('data-id', videoId);
    div.setAttribute('data-start', playerElements[n].getAttribute('data-start'));
    div.setAttribute('data-end', playerElements[n].getAttribute('data-end'));
    var thumbNode = document.createElement('img');
    thumbNode.src = '//i.ytimg.com/vi/ID/hqdefault.jpg'.replace(
      'ID',
      videoId
    );
    div.appendChild(thumbNode);

    // Create TextNode for title with class videotitle
    var videoTitle = document.createElement('div');
    var titleNode = document.createTextNode('');
    videoTitle.setAttribute('class', 'videotitle');
    videoTitle.setAttribute('id', thisPlayerId);
    videoTitle.appendChild(titleNode);
    div.appendChild(videoTitle);

    // Create the play button overlay on poster image
    var playButton = document.createElement('div');
    playButton.setAttribute('class', 'play');
    div.appendChild(playButton);
    div.onclick = function () {
      labnolIframe(this);
    };
    playerElements[n].appendChild(div);
  }
}
