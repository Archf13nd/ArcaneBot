const getYoutubeData = require('./getYoutubeData');

// Set number of iterations
// Check if playlist has song in it
// Check if queue has songs in it
// Check if next queue has songs in it

// POSSIBLE STATES
// No playlists in queue
// playlist in queue

// Iterates over set number of songs

// READ FROM END
// Helper function for traversing array backwards

const loadSong = async (theQueue, queueP, songP) => {
  const queue = theQueue;
  // Replaces query in playlist with song data from query
  const queryString = queue[queueP].arrayOfQueries[songP];
  const youtubeData = await getYoutubeData(queryString);
  queue[queueP].arrayOfQueries[songP] = youtubeData;

  return youtubeData;
};

module.exports = async (connection, quantity) => {
  const { queue } = connection.player;
  const loadedSongs = [];
  let queueCount = queue.length - 1;
  let songCount = null;
  for (let i = 0; i < quantity; i += 1) {
    if (queue[queueCount]) {
      if (songCount === null) {
        songCount = queue[queueCount].arrayOfQueries.length - 1;
      }

      if (queue[queueCount].arrayOfQueries[songCount]) {
        if (typeof queue[queueCount].arrayOfQueries[songCount] === 'string') {
          await loadSong(queue, queueCount, songCount);
          loadedSongs.push({
            youtubeData: queue[queueCount].arrayOfQueries[songCount],
            reqBy: queue[queueCount].reqBy,
          });
        } else {
          loadedSongs.push({
            youtubeData: queue[queueCount].arrayOfQueries[songCount],
            reqBy: queue[queueCount].reqBy,
          });
        }
        songCount -= 1;
      } else {
        queueCount -= 1;
        songCount = null;
      }
    }
  }
  return loadedSongs;
};
