// src/utils/soundManager.js
let isSoundEnabled = false;

const enableSound = () => {
  isSoundEnabled = true;
};

const playDing = () => {
  if (!isSoundEnabled) return;

  const audio = new Audio("/sound/ding-sfx-330333.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {});
};

// SABSE CLEAN WAY — DEFAULT + NAMED EXPORT
const soundManager = { enableSound, playDing };
export default soundManager;

export { enableSound, playDing };