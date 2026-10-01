// Web Audio API chime synthesizer - 100% reliable, zero external assets, amplified for maximum clarity
export const playAlertSound = (type = 'gentle') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Master Dynamics Compressor to maximize loudness without digital clipping/distortion
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, ctx.currentTime);
    compressor.knee.setValueAtTime(8, ctx.currentTime);
    compressor.ratio.setValueAtTime(4, ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    compressor.release.setValueAtTime(0.15, ctx.currentTime);
    compressor.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'love' || type === 'message') {
      // Celestial Romantic Chime (Loud, crystal-clear 4-bell arpeggio with rich harmonic body)
      const bells = [
        { freq: 1046.50, time: 0, dur: 0.65 },   // C6
        { freq: 1318.51, time: 0.12, dur: 0.70 }, // E6
        { freq: 1567.98, time: 0.24, dur: 0.75 }, // G6
        { freq: 2093.00, time: 0.36, dur: 0.90 }, // C7
      ];

      bells.forEach(({ freq, time, dur }) => {
        // Fundamental bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.85, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(compressor);
        osc.start(now + time);
        osc.stop(now + time + dur);

        // Harmonic shimmer overtone
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 1.5, now + time);

        overtoneGain.gain.setValueAtTime(0.45, now + time);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + time + dur * 0.7);

        overtone.connect(overtoneGain);
        overtoneGain.connect(compressor);
        overtone.start(now + time);
        overtone.stop(now + time + dur * 0.7);
      });

    } else if (type === 'meal' || type === 'loud_meal') {
      // Warm, loud cathedral dinner bell chime (Arpeggiated major chord with resonant ring)
      const chords = [
        { f: 523.25, offset: 0, dur: 0.75 },    // C5
        { f: 659.25, offset: 0.15, dur: 0.75 }, // E5
        { f: 783.99, offset: 0.30, dur: 0.85 }, // G5
        { f: 1046.50, offset: 0.45, dur: 1.10 } // C6
      ];

      chords.forEach(({ f, offset, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + offset);

        gain.gain.setValueAtTime(0.82, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(compressor);
        osc.start(now + offset);
        osc.stop(now + offset + dur);

        // Sub bell resonance
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(f * 0.5, now + offset);
        subGain.gain.setValueAtTime(0.35, now + offset);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur * 0.8);
        sub.connect(subGain);
        subGain.connect(compressor);
        sub.start(now + offset);
        sub.stop(now + offset + dur * 0.8);
      });

    } else if (type === 'alarm' || type === 'loud_alarm') {
      // High-Priority Loud Medical Hydration Alarm (3 sharp, penetrating dual-frequency pulses)
      [0, 0.45, 0.90].forEach((offset) => {
        // High penetrating crystal tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now + offset); // B5
        osc1.frequency.exponentialRampToValueAtTime(1479.98, now + offset + 0.18); // F#6

        gain1.gain.setValueAtTime(0.92, now + offset);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.38);

        osc1.connect(gain1);
        gain1.connect(compressor);
        osc1.start(now + offset);
        osc1.stop(now + offset + 0.38);

        // Body overtone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(493.88, now + offset); // B4
        osc2.frequency.exponentialRampToValueAtTime(739.99, now + offset + 0.18);

        gain2.gain.setValueAtTime(0.40, now + offset);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);

        osc2.connect(gain2);
        gain2.connect(compressor);
        osc2.start(now + offset);
        osc2.stop(now + offset + 0.35);
      });

    } else if (type === 'water' || type === 'loud_water') {
      // Sparkling loud hydration water drop chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

      gain1.gain.setValueAtTime(0.88, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain1);
      gain1.connect(compressor);
      osc1.start(now);
      osc1.stop(now + 0.45);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.51, now + 0.10); // E6
      osc2.frequency.exponentialRampToValueAtTime(1975.53, now + 0.25); // B6

      gain2.gain.setValueAtTime(0.75, now + 0.10);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.60);

      osc2.connect(gain2);
      gain2.connect(compressor);
      osc2.start(now + 0.10);
      osc2.stop(now + 0.60);

    } else {
      // Gentle clean notification
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5
      gain.gain.setValueAtTime(0.70, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(compressor);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
};
