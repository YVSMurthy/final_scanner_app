import TrackPlayer from 'react-native-track-player';

const playAudio = async (verify) => {
  // Load the correct audio based on the verify value
  const soundFile = verify ? require('./correct.mp3') : require('./invalid.mp3');


  console.log(verify ? 'valid' : 'invalid')
  await TrackPlayer.setupPlayer();

  // Add a track to the queue
    await TrackPlayer.add({
        id: 'trackId',
        url: require('track.mp3'),
        title: 'Track Title',
        artist: 'Track Artist',
        artwork: require('track.png')
  })
}

module.exports = {playAudio: playAudio}