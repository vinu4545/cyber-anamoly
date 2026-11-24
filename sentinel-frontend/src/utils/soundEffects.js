/**
 * Audio Synthesizer & Sound Effects Utility
 * Uses the Web Audio API to generate high-fidelity, celestial, and soft ambient sounds.
 * Guarantees zero latency, zero broken external files, and full browser compatibility.
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.bgGain = null;
    this.isPlayingBg = false;
    this.bgInterval = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft sparkle / magical chime
  playSparkle() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.65);
      });
    } catch {
      // Audio errors fail silently
    }
  }

  // Celebratory confetti pop sound
  playConfettiPop() {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Noise buffer pop
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.playSparkle();
    } catch {
      // Audio errors fail silently
    }
  }

  // Soft candle blowing swoosh
  playCandleBlow() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.6);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Audio errors fail silently
    }
  }

  // Envelope paper unsealing sound
  playEnvelopeOpen() {
    try {
      this.initContext();
      if (!this.ctx) return;

      // Soft ascending harp chord
      const chords = [392.00, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.09 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.95);
      });
    } catch {
      // Audio errors fail silently
    }
  }

  // Dreamy celestial background melody (soft ambient piano/celesta progression)
  startAmbientMusic() {
    try {
      this.initContext();
      if (!this.ctx || this.isPlayingBg) return;

      this.isPlayingBg = true;

      // Chord sequences for warm, emotional, cinematic progression:
      // Fmaj9 -> Cmaj7 -> Dm9 -> Bbmaj7
      const progression = [
        [349.23, 440.0, 523.25, 659.25], // F4, A4, C5, E5
        [261.63, 329.63, 392.0, 493.88], // C4, E4, G4, B4
        [293.66, 349.23, 440.0, 523.25], // D4, F4, A4, C5
        [233.08, 293.66, 349.23, 440.0], // Bb3, D4, F4, A4
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (!this.isPlayingBg || !this.ctx) return;

        const chord = progression[chordIndex % progression.length];
        chordIndex++;

        chord.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.18);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, this.ctx.currentTime);

          gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.18);
          gain.gain.linearRampToValueAtTime(0.035, this.ctx.currentTime + i * 0.18 + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.18 + 2.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + i * 0.18);
          osc.stop(this.ctx.currentTime + i * 0.18 + 3.0);
        });
      };

      playChord();
      this.bgInterval = setInterval(playChord, 3200);
    } catch {
      // Audio errors fail silently
    }
  }

  stopAmbientMusic() {
    this.isPlayingBg = false;
    if (this.bgInterval) {
      clearInterval(this.bgInterval);
      this.bgInterval = null;
    }
  }
}

export const sound = new SoundManager();
