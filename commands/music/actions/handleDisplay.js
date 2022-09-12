const createDisplay = require('../templates/main-display');

module.exports = (currentSong, currentPlaylist, loadedSongs) => {
  const display = createDisplay(currentSong, currentPlaylist, loadedSongs);
  return display;
};
