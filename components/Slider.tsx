import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Slider.module.css';

interface SliderProps {
  images: string[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.imageContainer}>
        <Image
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          layout="fill"
          objectFit="cover"
        />
        <div className={styles.overlay}>
          <button className={styles.previousButton} onClick={goToPreviousImage}>
            Previous
          </button>
          <button className={styles.nextButton} onClick={goToNextImage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
