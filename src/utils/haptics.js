// Haptics utility for tactile vibration feedback on supported mobile devices
export const triggerHaptic = (pattern = [15]) => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Gracefully ignore if device or permission blocks vibration
    }
  }
};
