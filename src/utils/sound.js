// Web Audio API chime synthesizer - 100% reliable, zero external files needed
export const playAlertSound = (type = 'gentle') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'water') {
      // Gentle water drop chime (two harmonious tones)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1174.66, now + 0.12); // D6
      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } else if (type === 'meal') {
      // Warm meal alert chime (triad arpeggio)
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } else if (type === 'alarm' || type === 'loud_alarm') {
      // Custom High-Priority Medical Alarm (3 melodic dual-tone bursts)
      const now = ctx.currentTime;
      [0, 0.45, 0.9].forEach((offset) => {
        // High crystal chime tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now + offset); // A5
        osc1.frequency.exponentialRampToValueAtTime(1318.51, now + offset + 0.15); // E6
        gain1.gain.setValueAtTime(0.35, now + offset);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now + offset);
        osc1.stop(now + offset + 0.35);

        // Resonant overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(587.33, now + offset + 0.05); // D5
        osc2.frequency.exponentialRampToValueAtTime(880, now + offset + 0.2); // A5
        gain2.gain.setValueAtTime(0.25, now + offset + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.38);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + offset + 0.05);
        osc2.stop(now + offset + 0.38);
      });
    } else {
      // Gentle notification
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
};
