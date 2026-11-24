import confetti from 'canvas-confetti';

/**
 * Premium Confetti Effects
 */

// Dual cannon celebratory blast
export function triggerCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FF8FAB', '#FFC2D1', '#C8B6FF', '#F5D58A', '#FFFFFF'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// Fullscreen fireworks explosion for finale
export function triggerGrandFinale() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
    colors: ['#FF8FAB', '#FFC2D1', '#C8B6FF', '#F5D58A', '#FFF9FC', '#FFD166'],
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 60 * (timeLeft / duration);

    // Left cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    // Right cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

// Gentle fairy dust / star burst when a candle is extinguished or wish made
export function triggerWishSparkles() {
  confetti({
    particleCount: 50,
    angle: 90,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#F5D58A', '#FFF9FC', '#FFC2D1', '#C8B6FF'],
    shapes: ['star', 'circle'],
    scalar: 1.1,
    ticks: 80,
    gravity: 0.8,
  });
}
