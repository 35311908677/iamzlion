import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Characters: Letters, Numbers, Katakana
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);

    // Rain drops - one per column
    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -height; // Start at random positions above screen
    }

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0F0'; // Neon Green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        
        // Randomly make some characters brighter or flicker
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#FFF'; // Flash white
        } else if (Math.random() > 0.9) {
          ctx.fillStyle = '#0FA'; // Lighter green
        } else {
          ctx.fillStyle = '#0F0';
        }

        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        // Reset drop to top randomly after it crosses the screen
        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }

        rainDrops[i]++;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newColumns = Math.floor(width / fontSize);
      // Adjust rainDrops array if columns change
      if (newColumns > rainDrops.length) {
        for (let i = rainDrops.length; i < newColumns; i++) {
          rainDrops[i] = Math.random() * -height;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    const interval = setInterval(draw, 33);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
      style={{ filter: 'contrast(1.2) brightness(0.8)' }}
    />
  );
};

export default MatrixBackground;
