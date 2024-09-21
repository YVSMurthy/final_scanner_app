import Sound from 'react-native-sound';

const playAudio = (verify) => {
  // Load the correct audio based on the verify value
  const soundFile = verify ? require('./correct.mp3') : require('./invalid.mp3');


  console.log(verify ? 'valid' : 'invalid')
  const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Failed to load sound', error);
      return;
    }
    // Play the sound
    sound.setVolume(1);
    sound.play((success) => {
      if (!success) {
        console.error('Sound playback failed');
      }
    });
  });

  // Cleanup function to release the sound
  return () => {
    sound.release();
  };
};

module.exports = {playAudio: playAudio}