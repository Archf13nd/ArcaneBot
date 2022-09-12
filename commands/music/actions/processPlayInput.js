const playDL = require('play-dl');
const InteractionError = require('../../../util/interactionError');
const getSpotifyData = require('./getSpotifyData');

const suppliers = {
  yt: 'youtube',
  sp: 'spotify',
  dz: 'deezer',
  so: 'soundcloud',
};

const determineSupplier = async (input) => {
  if (input.includes('https://deezer') || input.includes('https://soundcloud')) {
    const publicErrorMessage = 'Unsupported url';
    throw new InteractionError('Unsupported url', publicErrorMessage);
  }

  const supplier = await playDL.validate(input);

  if (!supplier) {
    const publicErrorMessage = 'Unsupported url';
    throw new InteractionError('Unsupported url', publicErrorMessage);
  }

  if (supplier === 'search') {
    return supplier;
  }

  const splitSupplier = supplier.split('_');

  // Replaces two letter abbreviation with full name
  splitSupplier[0] = suppliers[splitSupplier[0]];

  const supplierObject = {};
  supplierObject[splitSupplier[0]] = splitSupplier[1];
  //   console.log(supplierObject);
  return supplierObject;
};

module.exports = async (input) => {
  const supplier = await determineSupplier(input);

  if (supplier === 'search') {
    return {
      queries: [input],
      playlistName: null,
    };
  }
  if (supplier.spotify) {
    const spotifyData = await getSpotifyData(input);

    return spotifyData;
  }
  if (supplier.deezer) {
    throw new InteractionError('Deezer not supported', 'I\'m sorry, Deezer is not currently supported');
  }
  if (supplier.soundcloud) {
    throw new InteractionError('Soundcloud not supported', 'I\'m sorry, Deezer is not currently supported');
  }
  return true;
};
