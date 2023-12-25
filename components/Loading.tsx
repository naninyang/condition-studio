import React, { useState, useEffect, useRef } from 'react';
import { icons } from '@/icons';

const images = [`${icons.loading.loading1}`, `${icons.loading.loading2}`];

const Loading: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const changeImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const interval = setInterval(changeImage, 700);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.onload = () => {
      if (canvas && context) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    };
    image.src = images[currentImageIndex];
  }, [currentImageIndex]);

  return <canvas ref={canvasRef} width={50} height={50} />;
};

export default Loading;
