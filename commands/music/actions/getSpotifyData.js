const playDL = require('play-dl');
// const interactionError = require('../../../util/interactionError');

const createKeywordString = (track) => {
  const songName = track.name;
  const songArtist = track.artists[0].name;
  const searchString = `${songName} ${songArtist}`;
  return searchString;
};

module.exports = async (URL) => {
  const isValidSpotifyURL = playDL.sp_validate(URL);
  if (!isValidSpotifyURL) {
    throw new Error('Cannot handle non spotify urls with spotify funcion');
  }
  if (playDL.is_expired()) {
    await playDL.refreshToken();
  }

  const arrayOfKeywords = [];
  const data = await playDL.spotify(URL);
  if (data.type === 'track') {
    const searchString = createKeywordString(data);
    arrayOfKeywords.push(searchString);
  } else {
    const arrayOfTracks = await data.all_tracks();
    for (let i = 0; i < arrayOfTracks.length; i += 1) {
      const searchString = createKeywordString(arrayOfTracks[i]);
      arrayOfKeywords.push(searchString);
    }
  }
  arrayOfKeywords.reverse();

  return {
    queries: arrayOfKeywords,
    playlistName: data.name,
    playlistURL: data.url,
  };
};
