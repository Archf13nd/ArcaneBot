const getAudioResource = require('./getAudioResource');
const readyNextSongs = require('./readyNextSongs');
const handleDisplay = require('./handleDisplay');

module.exports = async (theConnection) => {
  const connection = theConnection;
  const { queue } = connection.player;

  // GLOBAL
  // Check for song in playlist or queue, return if false
  // load resources for next 4 songs
  // Get audio resource with youtube data
  // play the audio resource
  // Handle user message, pass in youtube data

  // If there are no songs left
  if (!connection.player.queue[0].arrayOfQueries[0]) {
    await connection.display.edit('End of tunes');
    return false;
  }
  // Removes empty playlists
  if (!queue[queue.length - 1].arrayOfQueries[0]) {
    queue.pop();
  }
  // Since there are songs in queue, ready those songs
  // Manipulates next number of songs in queue to be youtube data
  const loadedSongs = await readyNextSongs(connection, 4);

  // console.log('ALL LOADED SONGS', loadedSongs)

  if (connection.player.state.status === 'idle') {
    // Grabs youtube data from queue
    const youtubeData = await queue[queue.length - 1].arrayOfQueries.pop();
    connection.player.currentSong = {
      youtubeData,
      reqBy: queue[queue.length - 1].reqBy,
    };
    connection.player.currentPlaylist.name = queue[queue.length - 1].playlistName;
    connection.player.currentPlaylist.url = queue[queue.length - 1].playlistURL;
    loadedSongs.shift();
    // Gets audio stream with url from youtube data
    const audioResource = await getAudioResource(youtubeData.url);
    // loads audio resource and begins playback
    await connection.player.play(audioResource);
  }

  const { currentSong } = connection.player;
  const { currentPlaylist } = connection.player;

  const display = handleDisplay(currentSong, currentPlaylist, loadedSongs);
  await connection.display.edit(display);

  return true;
};
