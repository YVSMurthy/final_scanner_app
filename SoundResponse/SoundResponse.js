import Sound from 'react-native-sound';

const playAudio = (verify) => {
  // Load the correct audio based on the verify value
  const soundFile = !verify ? 'correct.mp3' : 'invalid.mp3';
  const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.error('Failed to load sound', error);
      return;
    }
    // Play the sound
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